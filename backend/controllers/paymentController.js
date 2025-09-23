// paymentController.js
import Order from '../models/orderModel.js';
import Payment from '../models/payment.js';
import crypto from 'crypto';

// Generate payment hash
export const generatePaymentHash = async (req, res) => {
  try {
    const { order_id, amount } = req.body;

    // Validate input
    if (!order_id || !amount) {
      return res.status(400).json({ error: 'Order ID and amount are required' });
    }

    // Find the order to verify it exists
    const order = await Order.findOne({ orderNumber: order_id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // PayHere merchant credentials
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const currency = 'LKR';
    
    // Ensure amount has exactly 2 decimal places
    const amountFormatted = parseFloat(amount).toFixed(2);

    // Helper to generate MD5 hash
    const getMd5 = (input) =>
      crypto.createHash('md5').update(input).digest('hex').toUpperCase();

    // Generate the hash
    const hash = getMd5(
      merchantId + order_id + amountFormatted + currency + getMd5(merchantSecret)
    );

    res.json({
      orderId: order_id,
      hash,
      amount: amountFormatted,
      merchantId,
      currency,
    });
  } catch (error) {
    console.error('Hash generation error:', error);
    res.status(500).json({ error: 'Failed to generate payment hash' });
  }
};

// Handle PayHere notification
export const handlePaymentNotification = async (req, res) => {
  try {
    console.log('PayHere Notification Received:', req.body);
    
    const paymentData = req.body;
    const { order_id, payment_id, status_code, ...otherData } = paymentData;

    // Validate required fields
    if (!order_id || !payment_id) {
      console.error('Invalid notification data:', paymentData);
      return res.status(400).send('Invalid notification data');
    }

    // Find the order
    const order = await Order.findOne({ orderNumber: order_id });
    if (!order) {
      console.error('Order not found:', order_id);
      return res.status(404).send('Order not found');
    }

    console.log('📦 Order found:', order.orderNumber);

    // Check for duplicate payments
    const existingPayment = await Payment.findOne({ transactionId: payment_id });
    if (existingPayment) {
      console.log('Payment already exists:', payment_id);
      return res.status(200).send('Payment already processed');
    }

  
    let paymentStatus = 'Pending';
    
    if (status_code === '2') {
      paymentStatus = 'Paid'; 
    } else if (status_code === '0') {
      paymentStatus = 'Pending'; 
    } else {
      paymentStatus = 'Failed'; 
    }

    // Create payment record 
    const payment = new Payment({
      orderId: order._id,
      transactionId: payment_id, 
      amount: parseFloat(paymentData.amount || order.orderTotal),
      currency: paymentData.currency || 'LKR',
      status: paymentStatus, 
      payhereStatus: status_code, 
      payhereData: paymentData,
      paymentMethod: 'payhere',
      supplier_id: order.supplier,
      manager_id: order.manager,
      payment_date: new Date()
    });

    // Save payment
    await payment.save();
    console.log('💾 Payment saved to database:', payment._id);

    // Update order status
    order.paymentStatus = paymentStatus; 
    order.payments = order.payments || [];
    order.payments.push(payment._id); 
    
    await order.save();
    console.log('📝 Order updated:', order.orderNumber);

    res.status(200).send('Notification processed successfully');

  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).send('Error processing payment notification');
  }
};
// Get supplier payments
export const getSupplierPayments = async (req, res) => {
  try {
    const { supplierId } = req.params;
    
    const payments = await Payment.find()
      .populate({
        path: 'orderId',
        match: { supplier: supplierId }
      })
      .sort({ paymentDate: -1 });

    // Filter out payments where orderId is null (not matching the supplier)
    const supplierPayments = payments.filter(payment => payment.orderId !== null);

    res.json(supplierPayments);
  } catch (error) {
    console.error('Error fetching supplier payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};