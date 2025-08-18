import express from 'express';
import { register, login, getAllUsers , getUserById , deleteUser, getSuppliers,getSupplierProfile,createSupplierProfile, registerSupplier, getSupplierByUserId} from '../controllers/userController.js';
import { authenticate, isAdminOrSelf } from '../middleware/authMddleware.js';


const router = express.Router();

// Register a new user
router.post('/register', authenticate, isAdminOrSelf, register);

// Login user
router.post('/login', login);

// Get all users (admin only)
router.get('/users', authenticate, isAdminOrSelf, getAllUsers);

// Get a single user by ID (admin only)
router.get('/users/:userId', authenticate, isAdminOrSelf, getUserById);

router.delete('/api/users/:id', authenticate, isAdminOrSelf, deleteUser);

// Get all suppliers 
router.get('/suppliers', authenticate, getSuppliers);

router.post('/suppliers/register', authenticate, isAdminOrSelf, registerSupplier);

router.post('/suppliers/:userId', authenticate, isAdminOrSelf, createSupplierProfile);
// Get supplier profile
router.get('/suppliers/:userId/profile', authenticate, getSupplierProfile);
router.get('/suppliers/user/:userId', authenticate, getSupplierByUserId);

export default router;