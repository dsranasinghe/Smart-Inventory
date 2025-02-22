import express from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
} from '../controllers/inventoryController.js';


const router = express.Router();

// Create a new inventory item
router.post('/', createItem);

// Get all inventory items
router.get('/', getAllItems);

// Get a single inventory item by ID
router.get('/:id', getItemById);

// Update an inventory item by ID
router.put('/:id', updateItem);

// Delete an inventory item by ID
router.delete('/:id', deleteItem);

export default router;
