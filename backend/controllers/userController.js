// controllers/authController.js (enhanced version)
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware.js';
import { serializeUser } from '../utils/serializers.js';

const VALID_ROLES = ['donor', 'receiver', 'volunteer', 'admin'];

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, city, state } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    if (role && !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role selected'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ 
      name, 
      email, 
      phone, 
      password: hashedPassword, 
      role: role || 'donor',
      city: city || '',
      state: state || ''
    });
    
    const savedUser = await user.save();
    
    // Generate JWT token
    const token = generateToken(savedUser);

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      token,
      user: serializeUser(savedUser)
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check if account is active
    if (user.isActive === false) {
      return res.status(401).json({ 
        success: false,
        message: 'Account is deactivated. Please contact admin.' 
      });
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      user: serializeUser(user)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true,
      count: users.length,
      users: users.map(serializeUser)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ 
      success: true,
      user: serializeUser(user)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Update user profile (only for authenticated user)
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, city, state } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    
    const updatedUser = await user.save();
    
    res.json({ 
      success: true,
      message: 'Profile updated successfully',
      user: serializeUser(updatedUser)
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Admin only: Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role selected'
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ 
      success: true,
      message: 'User role updated successfully',
      user: serializeUser(user)
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Admin only: Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
