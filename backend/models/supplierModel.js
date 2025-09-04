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
  },
   payment_status: { 
    type: String, 
    enum: ['pending', 'paid', 'partial', 'overdue'], 
    default: 'pending' 
  },
  last_payment_date: Date,
  balance: { type: Number, default: 0 }
});

// REMOVE VIRTUAL POPULATE COMPLETELY
export default mongoose.model('Supplier', supplierSchema);