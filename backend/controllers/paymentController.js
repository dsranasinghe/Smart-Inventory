import crypto from "crypto";
import Payment from "../models/payment.js";
import Order from "../models/orderModel.js";
import Supplier from "../models/supplierModel.js";

// Generate MD5 hash (helper function)
const getMd5 = (input) => {
  return crypto.createHash("md5").update(input).digest("hex").toUpperCase();
};

// -------------------- GENERATE PAYMENT HASH --------------------
export const generatePaymentHash = async (req, res) => {
  try {
    const { order_id, amount } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({ error: "Order ID and amount are required" });
    }

    const merchantID = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    const currency = "LKR";
    const amountFormatted = parseFloat(amount).toFixed(2);

    const hash = getMd5(
      merchantID + order_id + amountFormatted + currency + getMd5(merchantSecret)
    );

    res.json({
      orderId: order_id,
      hash,
      amount: amountFormatted,
      merchantId: merchantID,
      currency,
    });
  } catch (err) {
    console.error("Hash generation error:", err);
    res.status(500).json({ error: "Error generating payment hash" });
  }
};

// -------------------- SHARED SAVE PAYMENT LOGIC --------------------
const savePayment = async (paymentData) => {
  // Create payment record
  const newPayment = await Payment.create(paymentData);

  // Update order payment status
  await Order.findOneAndUpdate(
    { orderNumber: paymentData.order_id },
    {
      paymentStatus: "paid", // use lowercase to match enum
      paymentDate: new Date(),
    }
  );

  // Update supplier
  await Supplier.findByIdAndUpdate(paymentData.supplier_id, {
    $set: {
      payment_status: "paid",
      last_payment_date: new Date(),
    },
    $inc: { balance: -parseFloat(paymentData.amount) },
    $push: { orderHistory: newPayment._id },
  });

  return newPayment;
};

// -------------------- HANDLE PAYHERE NOTIFICATION --------------------
export const handlePaymentNotification = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      custom_1, // manager_id
      custom_2, // supplier_id
      method,
      status_message,
    } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    const localMd5sig = getMd5(
      merchant_id + order_id + payhere_amount + payhere_currency + status_code + getMd5(merchantSecret)
    ).toUpperCase();

    if (localMd5sig !== md5sig) {
      return res.status(400).json({ success: false, message: "Invalid MD5 signature" });
    }

    if (status_code !== "2") {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }

    // Check order exists
    const order = await Order.findOne({ orderNumber: order_id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const paymentData = {
      order_id,
      payment_id,
      amount: payhere_amount,
      currency: payhere_currency,
      status_code,
      method,
      status_message,
      supplier_id: custom_2,
      manager_id: custom_1,
      payment_date: new Date(),
    };

    await savePayment(paymentData);

    console.log("Payment processed successfully for order:", order_id);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error processing payment notification:", err);
    res.status(500).json({ success: false, message: "Error processing payment" });
  }
};

// -------------------- MANUAL SAVE PAYMENT --------------------
export const savePaymentManually = async (req, res) => {
  try {
    const {
      order_id,
      payment_id,
      amount,
      currency,
      status_code,
      method,
      status_message,
      supplier_id,
      manager_id,
    } = req.body;

    if (!order_id || !payment_id || !amount || !supplier_id || !manager_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const paymentData = {
      order_id,
      payment_id,
      amount,
      currency: currency || "LKR",
      status_code: status_code || "2",
      method: method || "manual",
      status_message: status_message || "Payment saved manually",
      supplier_id,
      manager_id,
      payment_date: new Date(),
    };

    const newPayment = await savePayment(paymentData);

    res.status(200).json({ success: true, payment: newPayment });
  } catch (err) {
    console.error("Error saving manual payment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- GET SUPPLIER PAYMENTS --------------------
export const getSupplierPayments = async (req, res) => {
  try {
    const { supplierId } = req.params;

    const payments = await Payment.find({ supplier_id: supplierId })
      .populate("manager_id", "username email")
      .sort({ payment_date: -1 });

    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Error fetching payment history" });
  }
};

// -------------------- UPDATE PAYMENT STATUS --------------------
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(id, { paymentStatus }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
