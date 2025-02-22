import Inventory from "../models/Inventory.js";

// Create an Inventory Item
export const createItem = async (req, res) => {
    try {
      const newItem = new Inventory(req.body);
      await newItem.save();
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Get All Inventory Items
  export const getAllItems = async (req, res) => {
    try {
      const items = await Inventory.find();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get Single Inventory Item by ID
  export const getItemById = async (req, res) => {
    try {
      const item = await Inventory.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update Inventory Item
  export const updateItem = async (req, res) => {
    try {
      const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete Inventory Item
  export const deleteItem = async (req, res) => {
    try {
      const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };