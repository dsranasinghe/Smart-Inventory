import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  supplier: { type: String },
  stockLevel: { type: Number, required: true, min: 0 },
  expirationDate: { type: Date },
  price: { type: Number, required: true, min: 0 },
  reorderThreshold: { type: Number, default: 10 },
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;