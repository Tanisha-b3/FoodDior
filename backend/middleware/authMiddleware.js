// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Verify JWT token and attach user to request
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required. Please login.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

// Role-based access middleware (flexible)
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. ${req.user.role} role is not authorized. Required roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

// Specific role middleware
export const isDonor = (req, res, next) => {
  if (req.user.role !== 'donor') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Donor role required' 
    });
  }
  next();
};

export const isReceiver = (req, res, next) => {
  if (req.user.role !== 'receiver') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Receiver role required' 
    });
  }
  next();
};

export const isVolunteer = (req, res, next) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Volunteer role required' 
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin role required' 
    });
  }
  next();
};

// Check if user owns the resource or is admin
export const isOwnerOrAdmin = (getResourceUserId) => {
  return async (req, res, next) => {
    try {
      const resourceUserId = await getResourceUserId(req);
      
      if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId.toString()) {
        next();
      } else {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You can only access your own resources' 
        });
      }
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error checking resource ownership' 
      });
    }
  };
};
