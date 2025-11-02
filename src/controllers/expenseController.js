const Expense = require('../models/Expense');

// Create a new expense
const addExpense = async (req, res, next) => {
  try {
    const { title, amount, date, category, paymentMethod, reimbursement, description, proofUrl } = req.body;

    // Create expense with user ID from authenticated user
    const expense = await Expense.create({
      title,
      amount,
      date,
      category,
      paymentMethod,
      reimbursement,
      description,
      proofUrl,
      userId: req.user.id,
    });

    // Populate user details
    await expense.populate({
      path: 'userId',
      select: 'name email',
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      statusCode: 201,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// Get all expenses with pagination and filtering
const getExpenses = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.body.page) || 1,
      limit: parseInt(req.body.limit) || 10,
      sort: req.body.sort || { createdAt: -1 },
      populate: {
        path: 'userId',
        select: 'name email',
      },
    };

    // Build query - get all expenses with optional search filters
    const query = { ...req.body.search };

    const expenses = await Expense.paginate(query, options);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single expense by ID
const getExpense = async (req, res, next) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Expense ID is required',
      });
    }

    const expense = await Expense.findOne({ _id, userId: req.user.id }).populate({
      path: 'userId',
      select: 'name email',
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// Update an expense
const updateExpense = async (req, res, next) => {
  try {
    const { _id, ...updateData } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Expense ID is required',
      });
    }

    // Find expense by ID and user to ensure user owns this expense
    const expense = await Expense.findOne({ _id, userId: req.user.id });

    if (!expense) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Expense not found',
      });
    }

    // Update expense
    const updatedExpense = await Expense.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    }).populate({
      path: 'userId',
      select: 'name email',
    });

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      statusCode: 200,
      data: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an expense
const deleteExpense = async (req, res, next) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Expense ID is required',
      });
    }

    // Find expense by ID and user to ensure user owns this expense
    const expense = await Expense.findOne({ _id, userId: req.user.id });

    if (!expense) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Expense not found',
      });
    }

    await Expense.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

// Search expenses with pagination and filtering
const searchExpense = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.body.page) || 1,
      limit: parseInt(req.body.limit) || 10,
      sort: req.body.sort || { createdAt: -1 },
      populate: {
        path: 'userId',
        select: 'name email',
      },
    };

    // Build query - get all expenses with optional search filters
    const query = { ...req.body.search };

    const expenses = await Expense.paginate(query, options);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// Get expense statistics (total, by category, by payment method)
const getExpenseStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    // Build query
    const query = { userId: req.user.id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get total expenses
    const totalExpenses = await Expense.countDocuments(query);

    // Get total amount
    const totalAmountResult = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

    // Get expenses by category
    const byCategory = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Get expenses by payment method
    const byPaymentMethod = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Get reimbursement status
    const byReimbursement = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$reimbursement',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        totalExpenses,
        totalAmount,
        byCategory,
        byPaymentMethod,
        byReimbursement,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  searchExpense,
  getExpenseStats,
};
