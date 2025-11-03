const express = require('express');
const router = express.Router();
const {
  addAccount,
  updateAccount,
  searchAccount,
  deleteAccount,
} = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

// All routes are protected - user must be authenticated

// Create new account
router.post('/addAccount', protect, addAccount);

// Update account
router.post('/updateAccount', protect, updateAccount);

// Search accounts with pagination and filtering
router.post('/searchAccount', protect, searchAccount);

// Delete account
router.post('/deleteAccount', protect, deleteAccount);

module.exports = router;
