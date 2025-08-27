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
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for items
supplierSchema.virtual('itemsSupplied', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'supplier'
});

// Virtual populate for orders
supplierSchema.virtual('orderHistory', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'supplier'
});

export default mongoose.model('Supplier', supplierSchema);