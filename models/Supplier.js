const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  contactPerson: String,
  email: {
    type: String,
    match: /.+\@.+\..+/,
  },
  phone: String,
  address: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
