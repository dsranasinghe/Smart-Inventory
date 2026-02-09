// models/supplierModel.js
import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: { 
    type: String,
    required: true
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
    default: []
  }],
  
  // FIXED: Changed from ObjectId references to actual payment history objects
  orderHistory: [{
    order_id: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    payment_date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
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

// Update the pre-save middleware to set the name from user
supplierSchema.pre('save', async function(next) {
  if (this.isNew && this.user) {
    const User = mongoose.model('User');
    const user = await User.findById(this.user);
    if (user) {
      this.name = user.username;
    }
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Supplier', supplierSchema);