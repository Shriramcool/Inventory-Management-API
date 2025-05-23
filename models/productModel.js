const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  SKU: {
    type: String,
    required: true,
    unique: true,
  },
  category: String,
  description: String,
  costPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  threshold: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'discontinued', 'out_of_stock'],
    default: 'active',
  },
  image: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
