import express from "express";
import {
  register,
  login,
  getAllUsers,
  getUserById,
  deleteUser,
  getSuppliers,
  getSupplierProfile,
  createSupplierProfile,
  registerSupplier,
  getSupplierByUserId,
} from "../controllers/userController.js";
import { authenticate, isAdminOrSelf } from "../middleware/authMddleware.js";
import {
  addItem,
  updateItem,
  deleteItem,
  getSupplierItems,
} from "../controllers/supplierController.js";
import {
  createOrder,
  getManagerOrders,
  getSupplierOrders,
  updateOrderStatus,
  testManager,
  updatePaymentStatus, 
} from "../controllers/orderController.js";

const router = express.Router();

// Register a new user
router.post("/register", authenticate, isAdminOrSelf, register);

// Login user
router.post("/login", login);

// Get all users (admin only)
router.get("/users", authenticate, isAdminOrSelf, getAllUsers);

// Get a single user by ID (admin only)
router.get("/users/:userId", authenticate, isAdminOrSelf, getUserById);

router.delete("/api/users/:id", authenticate, isAdminOrSelf, deleteUser);

// Get all suppliers
router.get("/suppliers", authenticate, getSuppliers);

router.post(
  "/suppliers/register",
  authenticate,
  isAdminOrSelf,
  registerSupplier
);

router.post(
  "/suppliers/:userId",
  authenticate,
  isAdminOrSelf,
  createSupplierProfile
);
// Get supplier profile
router.get("/suppliers/:userId/profile", authenticate, getSupplierProfile);
router.get("/suppliers/user/:userId", authenticate, getSupplierByUserId);

// New supplier item routes
router.get("/suppliers/:userId/items", authenticate, getSupplierItems);

router.post("/suppliers/:userId/items", authenticate, isAdminOrSelf, addItem);
router.put(
  "/suppliers/:userId/items/:itemId",
  authenticate,
  isAdminOrSelf,
  updateItem
);
router.delete(
  "/suppliers/:userId/items/:itemId",
  authenticate,
  isAdminOrSelf,
  deleteItem
);

// Order routes
router.post("/orders", authenticate, createOrder);
router.get("/orders", authenticate, getManagerOrders);
router.get("/orders/supplier/:userId", authenticate, getSupplierOrders);
router.put("/orders/:orderId/status", authenticate, updateOrderStatus);
router.patch("/orders/:id/payment-status", authenticate, updatePaymentStatus);
  

router.get("/test-manager", testManager);

export default router;
