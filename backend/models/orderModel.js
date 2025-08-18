import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPriceAtOrder: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  items: [orderItemSchema],
  orderTotal: {
    type: Number,
    required: true
  },
  deliveryType: {
    type: String,
    enum: ['Standard', 'Express', 'Overnight'],
    default: 'Standard'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  deliveryStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  trackingId: String,
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);