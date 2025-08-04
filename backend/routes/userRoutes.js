import express from 'express';
import { register, login, getAllUsers , getUserById , deleteUser, getSuppliers } from '../controllers/userController.js';
import { authenticate, isAdmin } from '../middleware/authMddleware.js';


const router = express.Router();

// Register a new user
router.post('/register', authenticate, isAdmin, register);

// Login user
router.post('/login', login);

// Get all users (admin only)
router.get('/users', authenticate, isAdmin, getAllUsers);

// Get a single user by ID (admin only)
router.get('/users/:userId', authenticate, isAdmin, getUserById);

router.delete('/api/users/:id', authenticate, isAdmin, deleteUser);

// Get all suppliers (admin/manager only)
router.get('/suppliers', authenticate, getSuppliers);
export default router;