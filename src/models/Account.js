const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const accountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: [true, 'Please provide an account name'],
    trim: true,
  },
  status: {
    type: Boolean,
    required: [true, 'Please provide account status'],
    default: true, // optional, set default as true or false as needed
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
accountSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add pagination plugin
accountSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Account', accountSchema);
