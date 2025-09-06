import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
   payment_id: { type: String, required: true }, 
  amount: { type: Number, required: true }, 
  currency: { type: String, default: 'LKR' },
  status_code: { type: String, required: true }, 
  method: { type: String }, 
  status_message: { type: String }, 
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  order_date: { type: Date, default: Date.now }, 
  payment_date: { type: Date, default: Date.now },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);