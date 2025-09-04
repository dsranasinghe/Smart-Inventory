import crypto from 'crypto';
import Payment from '../models/payment.js';
import Order from '../models/orderModel.js'; 
import Supplier from '../models/supplierModel.js'; 

// Generate MD5 hash (helper function)
const getMd5 = (input) => {
  return crypto.createHash('md5').update(input).digest('hex').toUpperCase();
};

// Generate payment hash for frontend
export const generatePaymentHash = async (req, res) => {
  try {
    const { order_id, amount } = req.body;
    
    // Validate input
    if (!order_id || !amount) {
      return res.status(400).json({ error: "Order ID and amount are required" });
    }

    const merchantID = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    
    const currency = "LKR";
    const amountFormatted = parseFloat(amount).toFixed(2);

    // Generate hash according to PayHere requirements
    const hash = getMd5(
      merchantID +
      order_id +
      amountFormatted +
      currency +
      getMd5(merchantSecret)
    );

    res.json({ 
      orderId: order_id, 
      hash: hash, 
      amount: amountFormatted,
      merchantId: merchantID,
      currency: currency
    });
  } catch (err) {
    console.error("Hash generation error:", err);
    res.status(500).json({ error: "Error generating payment hash" });
  }
};

// Handle PayHere server-to-server callbacks
export const handlePaymentNotification = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id, // Your orderNumber: "ORD-1756660497833-248"
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      custom_1, // manager_id
      custom_2, // supplier_id
      method,
      status_message
    } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // Verify MD5 signature for security
    const localMd5sig = getMd5(
      `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${getMd5(merchantSecret)}`
    );

    if (localMd5sig !== md5sig) {
      return res.status(400).json({ success: false, message: "Invalid MD5 signature" });
    }

    // Check if payment was successful (status_code 2 = success)
    if (status_code !== "2") {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }

    // Save successful payment to database
    const paymentData = {
      order_id,
      payment_id,
      amount: payhere_amount,
      currency: payhere_currency,
      status_code,
      method,
      status_message,
      supplier_id: custom_2, // supplier ID from custom field
      manager_id: custom_1, // manager ID from custom field
      payment_date: new Date()
    };

    // Save payment record
    const newPayment = await Payment.create(paymentData);
    
    // Update order payment status (if you have this field)
    await Order.findOneAndUpdate(
      { orderNumber: order_id },
      { 
        paymentStatus: 'paid',
        paymentDate: new Date()
      }
    );

    // Update supplier's payment status and balance
    await Supplier.findByIdAndUpdate(
      custom_2,
      { 
        $set: { payment_status: 'paid' },
        $push: { 
          orderHistory: {
            order_id: order_id,
            amount: payhere_amount,
            payment_date: new Date(),
            status: 'paid'
          }
        }
      }
    );

    console.log("Payment processed successfully:", order_id);
    res.json({ success: true });

  } catch (err) {
    console.error("Error processing payment notification:", err);
    res.status(500).json({ success: false, message: "Error processing payment" });
  }
};

// Get payment history for a supplier
export const getSupplierPayments = async (req, res) => {
  try {
    const { supplierId } = req.params;
    
    const payments = await Payment.find({ supplier_id: supplierId })
      .populate('manager_id', 'username email')
      .sort({ payment_date: -1 });

    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Error fetching payment history" });
  }
};
