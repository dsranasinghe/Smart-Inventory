import express from 'express';
import { 
  generatePaymentHash, 
  handlePaymentNotification, 
  getSupplierPayments,
  savePaymentManually 
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMddleware.js'; 

const router = express.Router();

// Generate hash for payment initiation (protected)
router.post('/generate-hash', authenticate, generatePaymentHash);

// Handle PayHere notification (public - PayHere will call this)
router.post('/notify', handlePaymentNotification);

router.post("/manual", authenticate, savePaymentManually);

// Get payment history for supplier (protected)
router.get('/supplier/:supplierId', authenticate, getSupplierPayments);


export default router;