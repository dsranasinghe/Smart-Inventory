import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryType: {
    type: String,
    enum: ['Standard', 'Express', 'Overnight'],
    default: 'Standard'
  },
  inStock: {
    type: Boolean,
    default: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Item', itemSchema);