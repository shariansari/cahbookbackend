const Account = require('../models/Account');

const addAccount = async (req, res, next) => {
  try {
    const { accountName, status } = req.body;


       console.log("status", status)

    if (!accountName) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Account name is required',
      });
    }

    const account = await Account.create({
      accountName,
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Account added successfully',
      statusCode: 201,
      data: account,
    });


  }
  catch (error) {
    next(error);
  }
}

// Update an account
const updateAccount = async (req, res, next) => {
  try {
    const { _id, accountName } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Account ID is required',
      });
    }

    if (!accountName) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Account name is required',
      });
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      _id,
      { accountName },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Account updated successfully',
      statusCode: 200,
      data: updatedAccount,
    });
  } catch (error) {
    next(error);
  }
};

// Search accounts with pagination and filtering
const searchAccount = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.body.page) || 1,
      limit: parseInt(req.body.limit) || 10,

    };

    // Build query - get accounts for the authenticated user with optional search filters
    const query = {};

    // Add search filters if provided
    if (req.body.search) {
      if (req.body.search.accountName) {
        query.accountName = { $regex: req.body.search.accountName, $options: 'i' };
      }
      // Merge any other search criteria
      Object.keys(req.body.search).forEach((key) => {
        if (key !== 'accountName') {
          query[key] = req.body.search[key];
        }
      });
    }

    const accounts = await Account.paginate(query, options);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: accounts,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an account
const deleteAccount = async (req, res, next) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Account ID is required',
      });
    }

    // Find account by ID
    const account = await Account.findById(_id);

    if (!account) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Account not found',
      });
    }

    await Account.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAccount,
  updateAccount,
  searchAccount,
  deleteAccount,
};
