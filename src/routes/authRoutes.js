const express = require('express');
const router = express.Router();
const { register, login, getMe, searchUser, updateUser, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  loginValidation,
  validate,
} = require('../middleware/validator');

// Register route
router.post('/register', register);

// Login route
router.post('/login', loginValidation, validate, login);

// Get current user (protected route) - POST method
router.post('/me', protect, getMe);

// Search user by email or phone (protected route) - POST method with pagination
router.post('/searchUser', protect, searchUser);

// Update user (protected route) - POST method
router.post('/updateUser', protect, updateUser);

// Delete user (protected route) - POST method
router.post('/deleteUser', protect, deleteUser);

module.exports = router;
