const express = require('express');
const router = express.Router();
const {
  addExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  searchExpense,
  getExpenseStats,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

// All routes are protected - user must be authenticated

// Create new expense
router.post('/addExpense', protect, addExpense);

// Get all expenses with pagination and filtering
router.post('/getExpenses', protect, getExpenses);

// Search expenses with pagination and filtering
router.post('/searchExpense', protect, searchExpense);

// Get single expense
router.post('/getExpense', protect, getExpense);

// Update expense
router.post('/updateExpense', protect, updateExpense);

// Delete expense
router.post('/deleteExpense', protect, deleteExpense);

// Get expense statistics
router.post('/stats', protect, getExpenseStats);

module.exports = router;
