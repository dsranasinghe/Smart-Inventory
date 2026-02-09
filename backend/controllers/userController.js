import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import Supplier from '../models/supplierModel.js';


// Register a new user
export const register = async (req, res) => { 
  try {
    const { username, email, password, role, phoneNumber, address } = req.body;

    // Check if admin is making the request
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can register users' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password, role });
    await user.save();

    // If role is supplier, create supplier profile
    if (role === 'supplier') {
      const supplier = new Supplier({
        user: user._id,
        name: username, 
        phoneNumber: phoneNumber || '',
        address: address || '',
        itemsSupplied: [],
        orderHistory: []
      });
      await supplier.save();
    }

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};


// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

  // Return the token and user data (excluding the password)
  res.status(200).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
  
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get a single user by ID (admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user); // Return the user object directly
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await User.find({ role: 'supplier' });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the ID is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createSupplierProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { phoneNumber, address } = req.body;

    // Check if user exists and is a supplier
    const user = await User.findById(userId);
    if (!user || user.role !== 'supplier') {
      return res.status(404).json({ message: 'Supplier user not found' });
    }

    // Create supplier profile
    const supplier = new Supplier({
      user: userId,
      phoneNumber,
      address,
      itemsSupplied: [],
      orderHistory: []
    });

    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplier profile', error });
  }
};
export const registerSupplier = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, address } = req.body;

    // Check if admin is making the request
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can register suppliers' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 1. Create User record
    const user = new User({
      username,
      email,
      password,
      role: 'supplier' // Force role to supplier
    });
    await user.save();

    // 2. Automatically create Supplier profile
    const supplier = new Supplier({
      user: user._id, // Reference the new user
      phoneNumber,
      address,
      itemsSupplied: [], // Initialize empty arrays
      orderHistory: []
    });
    await supplier.save();

    res.status(201).json({
      message: 'Supplier registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      supplierProfile: {
        phoneNumber: supplier.phoneNumber,
        address: supplier.address
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering supplier',
      error: error.message 
    });
  }
};



// Get supplier profile
export const getSupplierProfile = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ user: req.params.userId })
      .populate('user')
      .populate('itemsSupplied')
      .populate({
        path: 'orderHistory',
        populate: {
          path: 'items.item',
          model: 'Item'
        }
      });
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSupplierByUserId = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ user: req.params.userId })
      .populate('user') 
      .populate('itemsSupplied')
      .populate({
        path: 'orderHistory',
        populate: {
          path: 'items.item',
          model: 'Item'
        }
      });
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ message: 'Server error' });
  }
};