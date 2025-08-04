import express from 'express';
import { register, login, getAllUsers , getUserById , deleteUser, getSuppliers,getSupplierProfile,createSupplierProfile, registerSupplier} from '../controllers/userController.js';
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

// Get all suppliers 
router.get('/suppliers', authenticate, getSuppliers);

router.post('/suppliers/register', authenticate, isAdmin, registerSupplier);

router.post('/suppliers/:userId', authenticate, isAdmin, createSupplierProfile);
// Get supplier profile
router.get('/suppliers/:userId/profile', authenticate, getSupplierProfile);

export default router;