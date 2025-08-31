import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  itemsSupplied: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: []  // ← ACTUAL ARRAY (NOT VIRTUAL)
  }],
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', 
    default: []  // ← ACTUAL ARRAY (NOT VIRTUAL)
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// REMOVE VIRTUAL POPULATE COMPLETELY
export default mongoose.model('Supplier', supplierSchema);