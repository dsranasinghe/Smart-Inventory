import express from 'express';
import { register, login, getAllUsers , getUserById } from '../controllers/userController.js';
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

export default router;