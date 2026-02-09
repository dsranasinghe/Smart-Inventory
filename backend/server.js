import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './config/db.js'; 
import cors from 'cors';
import inventoryRoutes from './routes/InventoryRoutes.js';   
import paymentRoutes from './routes/paymentRoutes.js';            

dotenv.config();

const app = express();

// Connect to MongoDB first
connectDB(); 

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
  })
);

// Middleware to parse JSON
app.use(express.json());

// Routes - organized logically
app.use('/api', userRoutes);          
app.use('/api/inventory', inventoryRoutes); // Inventory management routes  
app.use('/api/payments', paymentRoutes);    // Payment processing routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running successfully' });
});

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});