// routes/userRoutes.js
import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUsers, 
  getCurrentUser,
  updateUserProfile,
  updateUserRole,
  deleteUser
} from "../controllers/userController.js"
import { 
  authenticate, 
  authorize, 
  isAdmin 
} from "../middleware/authMiddleware.js"

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (authentication required)
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateUserProfile);

// Admin only routes
router.get('/users', authenticate, isAdmin, getUsers);
router.put('/users/:userId/role', authenticate, isAdmin, updateUserRole);
router.delete('/users/:userId', authenticate, isAdmin, deleteUser);

// Routes with multiple role access
router.get('/dashboard', 
  authenticate, 
  authorize('donor', 'receiver', 'volunteer', 'admin'), 
  (req, res) => {
    res.json({ 
      success: true,
      message: `Welcome to ${req.user.role} dashboard`,
      user: req.user
    });
  }
);

export default router;