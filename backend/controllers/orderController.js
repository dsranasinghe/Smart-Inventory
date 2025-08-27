import Order from '../models/orderModel.js';
import Supplier from '../models/supplierModel.js';
import User from '../models/User.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, description, expectedDeliveryDate, supplier } = req.body;
    const managerId = req.user.id;

    // Verify supplier exists
    const supplierExists = await Supplier.findById(supplier);
    if (!supplierExists) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const order = new Order({
      items,
      description,
      expectedDeliveryDate,
      supplier,
      manager: managerId
    });

    const savedOrder = await order.save();
    
    // Populate the order with supplier and item details
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('supplier', 'username email')
      .populate('items.item', 'name category price');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders for manager
export const getManagerOrders = async (req, res) => {
  try {
    const managerId = req.user.id;
    
    const orders = await Order.find({ manager: managerId })
      .populate('supplier', 'username email')
      .populate('items.item', 'name category price')
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders for specific supplier
export const getSupplierOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find supplier by user ID
    const supplier = await Supplier.findOne({ user: userId });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const orders = await Order.find({ supplier: supplier._id })
      .populate('manager', 'username email')
      .populate('items.item', 'name category price')
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryStatus },
      { new: true, runValidators: true }
    ).populate('supplier', 'username email')
     .populate('items.item', 'name category price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};