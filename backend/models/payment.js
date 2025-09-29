import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  transactionId: { 
    type: String, 
    required: true,
    unique: true 
  }, 
  amount: { 
    type: Number, 
    required: true 
  }, 
  currency: { 
    type: String, 
    default: 'LKR' 
  },
 
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'], 
    default: 'Pending'
  },
  
  payhereStatus: { 
    type: String  
  },
  payhereData: { 
    type: Object  
  },
 
  paymentMethod: {
    type: String,
    default: 'payhere'
  },
  
  supplier_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Supplier', 
    required: true 
  },
  manager_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  payment_date: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;