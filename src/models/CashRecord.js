const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cashbookRecordSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount cannot be negative'],
  },

  // Store timestamp (milliseconds)
  date: {
    type: Number,
    required: [true, 'Please provide a date'],
    default: () => Date.now(),
  },

  paymentMethod: {
    type: String,
    required: [true, 'Please provide a payment method'],
    enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Other'],
  },

  description: {
    type: String,
    trim: true,
  },

  proofUrl: {
    type: String,
    trim: true,
  },

  cashMethod: {
    type: String,
    enum: ['cashIn', 'cashOut'],
    required: [true, 'Please specify cash method (cashIn or cashOut)'],
  },

  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Please provide an account ID'],
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID'],
  },

  createdAt: {
    type: Number,
    default: () => Date.now(),
  },

  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
});

// Update `updatedAt` before saving
cashbookRecordSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add pagination plugin
cashbookRecordSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('CashRecord', cashbookRecordSchema);
