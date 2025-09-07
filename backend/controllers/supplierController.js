import Supplier from '../models/supplierModel.js';
import Item from '../models/itemModel.js';
import Order from '../models/orderModel.js';
import { Types } from 'mongoose';

// Add new item to supplier's inventory
export const addItem = async (req, res) => {
    console.log('Add Item Request Received:', {
    params: req.params,
    body: req.body,
    user: req.user
  });
  try {
    const { userId } = req.params;
    const { name, description, unitPrice, deliveryType, inStock , category } = req.body;

    // Find supplier by userId
    const supplier = await Supplier.findOne({ user: userId });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Create new item
    const newItem = await Item.create({
      name,
      description,
      unitPrice,
      category,
      deliveryType,
      inStock,
      supplier: supplier._id
    });

    // ADD THE NEW ITEM TO THE SUPPLIER'S itemsSupplied ARRAY
    supplier.itemsSupplied.push(newItem._id);
    await supplier.save();

    // Populate the item to return complete data
    const populatedItem = await Item.findById(newItem._id);

    res.status(201).json(populatedItem);

  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};


// Update existing item
export const updateItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    // Verify supplier exists
    const supplier = await Supplier.findOne({ user: userId });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Update item only if it belongs to this supplier
    const updatedItem = await Item.findOneAndUpdate(
      { _id: itemId, supplier: supplier._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found for this supplier' });
    }

    res.status(200).json({
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating item',
      error: error.message 
    });
  }
};

// Delete item from inventory
export const deleteItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    const supplier = await Supplier.findOne({ user: userId });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Delete only if item belongs to this supplier
    const deletedItem = await Item.findOneAndDelete({
      _id: itemId,
      supplier: supplier._id
    });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found for this supplier' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting item',
      error: error.message 
    });
  }
};

// Add new order to supplier's history
export const addOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const supplier = await Supplier.findOne({ user: userId });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Verify all items belong to this supplier
    const itemIds = req.body.items.map(i => i.item);
    const items = await Item.find({ _id: { $in: itemIds } });
    
    const invalidItems = items.filter(i => i.supplier.toString() !== supplier._id.toString());
    if (invalidItems.length > 0) {
      return res.status(400).json({
        message: 'Some items do not belong to this supplier'
      });
    }

    // Create order with item snapshots
    const orderItems = req.body.items.map(orderItem => {
      const item = items.find(i => i._id.toString() === orderItem.item);
      return {
        item: item._id,
        quantity: orderItem.quantity,
        unitPriceAtOrder: item.unitPrice
      };
    });

    const orderTotal = orderItems.reduce(
      (total, item) => total + (item.unitPriceAtOrder * item.quantity),
      0
    );

    const newOrder = await Order.create({
      ...req.body,
      items: orderItems,
      orderTotal,
      supplier: supplier._id,
      customer: req.user.id
    });

    res.status(201).json({
      message: 'Order added successfully',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding order',
      error: error.message 
    });
  }
};



// Get supplier items  for order page
export const getSupplierItems = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find supplier by user ID
    const supplier = await Supplier.findOne({ user: userId }).populate('itemsSupplied');
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier.itemsSupplied || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};