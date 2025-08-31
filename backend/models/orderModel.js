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
  description: {
    type: String,
    default: ''
  },
  expectedDeliveryDate: {
    type: Date,
    required: true
  },
  deliveryStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  trackingId: {
    type: String,
    unique: true,
    sparse: true // ← ADD THIS to allow multiple null values
  }
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Calculate order total before saving
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.orderTotal = this.items.reduce((total, item) => {
      return total + (item.unitPriceAtOrder * item.quantity);
    }, 0);
  }
  // ADD THIS: Generate trackingId if not provided
  if (!this.trackingId) {
    this.trackingId = `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);