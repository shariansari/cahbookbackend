const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount cannot be negative'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please provide a payment method'],
    enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Other'],
  },
  reimbursement: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No',
  },
  description: {
    type: String,
    trim: true,
  },
  proofUrl: {
    type: String,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
expenseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add pagination plugin
expenseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Expense', expenseSchema);
