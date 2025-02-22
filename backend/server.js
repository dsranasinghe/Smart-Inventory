import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './config/db.js'; 
import cors from 'cors';
import inventoryRoutes from './routes/InventoryRoutes.js';              

dotenv.config();

const app = express();
// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from the frontend
    credentials: true, // Allow cookies and credentials
  })
);

// Middleware to parse JSON
app.use(express.json());


// Connect to MongoDB
connectDB(); 

// Use user routes
app.use('/api', userRoutes);

app.use('/api/inventory', inventoryRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});