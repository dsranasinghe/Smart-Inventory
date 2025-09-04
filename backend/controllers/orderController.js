import Order from '../models/orderModel.js';
import Supplier from '../models/supplierModel.js';
import User from '../models/User.js';
import Item from '../models/itemModel.js';
import mongoose from 'mongoose';


// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, description, expectedDeliveryDate, supplier } = req.body;
    const managerId = req.user.id;

    // Verify supplier exists - find by user ID
    const supplierExists = await Supplier.findOne({ user: supplier });
    if (!supplierExists) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Get current prices for all items and calculate order total
    const orderItemsWithPrices = await Promise.all(
      items.map(async (orderItem) => {
        const item = await Item.findById(orderItem.item);
        if (!item) {
          throw new Error(`Item ${orderItem.item} not found`);
        }
        return {
          item: orderItem.item,
          quantity: orderItem.quantity,
          unitPriceAtOrder: item.unitPrice || item.price // Use the correct field name
        };
      })
    );

    // Calculate order total
    const orderTotal = orderItemsWithPrices.reduce((total, item) => {
      return total + (item.unitPriceAtOrder * item.quantity);
    }, 0);

    const order = new Order({
      items: orderItemsWithPrices,
      description,
      expectedDeliveryDate,
      supplier: supplierExists._id,
      manager: managerId,
      orderTotal
    });

    const savedOrder = await order.save();
    
   // Populate the order with supplier (including user details) and item details
const populatedOrder = await Order.findById(savedOrder._id)
  .populate({
    path: 'supplier',
    populate: {
      path: 'user',
      select: 'username email'
    }
  })
  .populate('items.item', 'name unitPrice price')
  .populate('manager', 'username email role'); 





res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: error.message });
  }
};
// Get all orders for manager
export const getManagerOrders = async (req, res) => {
  try {
    const managerId = req.user.id;
    
   // In your getManagerOrders function, add:
const orders = await Order.find({ manager: managerId })
  .populate({
    path: 'supplier',
    populate: {
      path: 'user',
      select: 'username email'
    }
  })
  .populate('items.item', 'name category price unitPrice')
  .sort({ orderDate: -1 });


res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSupplierOrders = async (req, res) => {
  try {
    
    const { userId } = req.params;
    
    
    const supplier = await Supplier.findOne({ user: userId });
   
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Get orders
    const orders = await Order.find({ supplier: supplier._id })
      .sort({ orderDate: -1 })
      .lean();


    // MANUALLY fetch the manager's username
    if (orders.length > 0 && orders[0].manager) {
      console.log('Fetching manager username for ID:', orders[0].manager);
      const manager = await User.findById(orders[0].manager).select('username').lean();
      console.log('Found manager:', manager);
      
      // Add manager username to ALL orders
      const ordersWithManager = orders.map(order => ({
        ...order,
        manager: { username: manager?.username || 'Unknown' }
      }));

     
      res.json(ordersWithManager);
    } else {
     
      res.json(orders);
    }
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

// Add this function to your orderController.js
export const testManager = async (req, res) => {
  try {
   
    
    // Test if we can fetch the manager directly
    const manager = await User.findById('67b0fb3e09012d065f8e8a15');
   
    
    res.json({ 
      success: true, 
      manager: manager ? { username: manager.username } : null 
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};