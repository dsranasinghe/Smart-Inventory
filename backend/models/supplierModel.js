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
    name: {
      type: String,
      required: true
    },
    description: String,
    unitPrice: {
      type: Number,
      required: true
    },
    deliveryType: {
      type: String,
      enum: ['Doorstep', 'Pickup'],
      default: 'Doorstep'
    },
    inStock: {
      type: Boolean,
      default: true
    }
  }],
  orderHistory: [{
    orderDate: {
      type: Date,
      default: Date.now
    },
    deliveryType: String,
    trackingId: String,
    orderTotal: Number,
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    },
    deliveryStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered'],
      default: 'Processing'
    }
  }]
}, { timestamps: true });

export default mongoose.model('Supplier', supplierSchema);