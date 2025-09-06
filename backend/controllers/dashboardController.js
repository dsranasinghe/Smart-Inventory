// controllers/dashboardController.js
import Order from '../models/orderModel.js';
import Item from '../models/itemModel.js';
import Payment from '../models/payment.js';
import Supplier from '../models/supplierModel.js';

// Get dashboard overview data
export const getDashboardData = async (req, res) => {
  try {
    // Get counts
    const totalProducts = await Item.countDocuments();
    const outOfStock = await Item.countDocuments({ currentStock: 0 });
    const lowStockItems = await Item.countDocuments({ 
      currentStock: { $gt: 0, $lt: 10 }
    });
    
    // Get distinct categories
    const categories = await Item.distinct("category");
    const totalCategories = categories.length;

    // Inventory overview for chart (by category)
    const inventoryOverview = await Item.aggregate([
      {
        $group: {
          _id: "$category",
          stock: { $sum: "$currentStock" },
          outOfStock: {
            $sum: { $cond: [{ $eq: ["$currentStock", 0] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          name: "$_id",
          stock: 1,
          outOfStock: 1,
          _id: 0
        }
      }
    ]);

    // Order trends for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orderTrends = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$orderDate" },
            year: { $year: "$orderDate" }
          },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          name: {
            $let: {
              vars: {
                months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
              },
              in: {
                $concat: [
                  { $arrayElemAt: ["$$months", { $subtract: ["$_id.month", 1] }] },
                  " ",
                  { $toString: "$_id.year" }
                ]
              }
            }
          },
          orders: 1,
          _id: 0
        }
      }
    ]);

    // Get total pending payments
    const pendingPayments = await Order.countDocuments({
      paymentStatus: 'Pending'
    });

    // Get total order value this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$orderTotal" }
        }
      }
    ]);

    const monthlyRevenue = monthlyOrders.length > 0 ? monthlyOrders[0].totalAmount : 0;

    res.json({
      totalProducts,
      outOfStock,
      lowStockItems,
      totalCategories,
      pendingPayments,
      monthlyRevenue,
      inventoryOverview: inventoryOverview.slice(0, 5),
      orderTrends: orderTrends.slice(0, 6)
    });

  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
};

// Get low stock items
export const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Item.find({
      currentStock: { $gt: 0, $lt: 10 }
    })
    .select('name currentStock minimumStock category')
    .sort({ currentStock: 1 })
    .limit(10);

    res.json(lowStockItems);
  } catch (error) {
    console.error("Low stock items error:", error);
    res.status(500).json({ message: "Error fetching low stock items", error: error.message });
  }
};

// Get recent orders
export const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(10)
      .populate('supplier', 'user')
      .populate('items.item', 'name')
      .select('orderNumber orderDate deliveryStatus paymentStatus items orderTotal');

    res.json(recentOrders);
  } catch (error) {
    console.error("Recent orders error:", error);
    res.status(500).json({ message: "Error fetching recent orders", error: error.message });
  }
};

// Get recent transactions
export const getRecentTransactions = async (req, res) => {
  try {
    const recentTransactions = await Payment.find()
      .sort({ payment_date: -1 })
      .limit(10)
      .populate('supplier_id', 'name')
      .populate('manager_id', 'username')
      .select('amount payment_date status_code method order_id supplier_id manager_id');

    // Format the transactions for frontend
    const formattedTransactions = recentTransactions.map(transaction => ({
      id: transaction._id,
      amount: transaction.amount,
      date: transaction.payment_date,
      status: transaction.status_code === "2" ? "success" : "failed",
      method: transaction.method,
      orderId: transaction.order_id,
      supplier: transaction.supplier_id?.name || "Unknown Supplier",
      manager: transaction.manager_id?.username || "Unknown Manager"
    }));

    res.json(formattedTransactions);
  } catch (error) {
    console.error("Recent transactions error:", error);
    res.status(500).json({ message: "Error fetching recent transactions", error: error.message });
  }
};