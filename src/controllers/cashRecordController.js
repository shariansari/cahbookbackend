const mongoose = require('mongoose');
const CashRecord = require('../models/CashRecord');

// ===============================
// Create a new cash record
// ===============================
const addCashRecord = async (req, res, next) => {
  try {
    const {
      amount,
      date,
      paymentMethod,
      description,
      proofUrl,
      cashMethod,
      accountId,
    } = req.body;

    const record = await CashRecord.create({
      amount,
      date: date ? Number(date) : Date.now(),
      paymentMethod,
      description,
      proofUrl,
      cashMethod,
      accountId,
      userId: req.user.id,
    });

    await record.populate([
      { path: 'userId', select: 'name email' },
      { path: 'accountId', select: 'accountName status' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Cash record added successfully',
      statusCode: 201,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// Get all cash records (paginated)
// ===============================
const searchCashRecords = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.body.page) || 1,
      limit: parseInt(req.body.limit) || 10,
      sort: req.body.sort || { createdAt: -1 },
      populate: [
        { path: 'userId', select: 'name email' },
        { path: 'accountId', select: 'accountName status' },
      ],
    };

    const query = { ...req.body.search };

    const records = await CashRecord.paginate(query, options);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// Get a single cash record by ID
// ===============================
const searchCashRecord = async (req, res, next) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Cash record ID is required',
      });
    }

    const record = await CashRecord.findOne({
      _id,
      userId: req.user.id,
    }).populate([
      { path: 'userId', select: 'name email' },
      { path: 'accountId', select: 'accountName status' },
    ]);

    if (!record) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Cash record not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// Update a cash record
// ===============================
const updateCashRecord = async (req, res, next) => {
  try {
    const { _id, ...updateData } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Cash record ID is required',
      });
    }

    const record = await CashRecord.findOne({ _id, userId: req.user.id });

    if (!record) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Cash record not found',
      });
    }

    updateData.updatedAt = Date.now();

    const updatedRecord = await CashRecord.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    }).populate([
      { path: 'userId', select: 'name email' },
      { path: 'accountId', select: 'accountName status' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Cash record updated successfully',
      statusCode: 200,
      data: updatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// Delete a cash record
// ===============================
const deleteCashRecord = async (req, res, next) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Cash record ID is required',
      });
    }

    const record = await CashRecord.findOne({ _id, userId: req.user.id });

    if (!record) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Cash record not found',
      });
    }

    await CashRecord.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: 'Cash record deleted successfully',
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// Get Cash Record Stats
// ===============================
const getCashRecordStats = async (req, res, next) => {
  try {
    const { startDate, endDate, search } = req.body;

    const query = {};

    // ✅ Add userId filter (from search or token)
    if (search?.userId && mongoose.Types.ObjectId.isValid(search.userId)) {
      query.userId = new mongoose.Types.ObjectId(search.userId);
    } else if (req.user?.id) {
      query.userId = new mongoose.Types.ObjectId(req.user.id);
    }

    // ✅ Add accountId filter if valid
    if (search?.accountId && mongoose.Types.ObjectId.isValid(search.accountId)) {
      query.accountId = new mongoose.Types.ObjectId(search.accountId);
    }

    // ✅ Add date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = Number(startDate);
      if (endDate) query.date.$lte = Number(endDate);
    }

    console.log("📘 MongoDB Query:", query);

    // ✅ total records
    const totalRecords = await CashRecord.countDocuments(query);

    // ✅ totalIn and totalOut
    const totals = await CashRecord.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$cashMethod',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalIn = totals.find((t) => t._id === 'cashIn')?.total || 0;
    const totalOut = totals.find((t) => t._id === 'cashOut')?.total || 0;
    const netBalance = totalIn - totalOut;

    // ✅ group by payment method
    const byPaymentMethod = await CashRecord.aggregate([
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

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        totalRecords,
        totalIn,
        totalOut,
        netBalance,
        byPaymentMethod,
      },
    });
  } catch (error) {
    console.error("❌ getCashRecordStats Error:", error);
    next(error);
  }
};

// ===============================
// Exports
// ===============================
module.exports = {
  addCashRecord,
  searchCashRecords,
  searchCashRecord,
  updateCashRecord,
  deleteCashRecord,
  getCashRecordStats,
};
