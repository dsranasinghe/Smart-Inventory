import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Divider,
  useColorMode,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { 
  FaBox, 
  FaShoppingCart, 
  FaLayerGroup, 
  FaSun, 
  FaMoon, 
  FaTrashAlt, 
  FaEdit, 
  FaArrowUp,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaChartLine
} from "react-icons/fa";
import {
  BarChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  ResponsiveContainer
} from "recharts";
import Sidebar from "../components/sidebar";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const toast = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
        return;
      }

      const [dashboardRes, lowStockRes, ordersRes, transactionsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error("Dashboard data error:", error);
          return { data: null };
        }),
        axios.get("http://localhost:5000/api/dashboard/low-stocks", {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error("Low stock items error:", error);
          return { data: [] };
        }),
        axios.get("http://localhost:5000/api/orders?limit=5", {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error("Recent orders error:", error);
          return { data: [] };
        }),
        axios.get("http://localhost:5000/api/transactions/recent", {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error("Recent transactions error:", error);
          return { data: [] };
        })
      ]);

      setDashboardData(dashboardRes.data);
      setLowStockItems(lowStockRes.data || []);
      setRecentOrders(ordersRes.data || []);
      setTransactions(transactionsRes.data || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOrderNow = (itemId) => {
    navigate(`/orders/new?item=${itemId}`);
  };

  const inventoryChartData = dashboardData?.inventoryOverview || [];
  const ordersChartData = dashboardData?.orderTrends || [];

  const stats = [
    {
      icon: FaBox,
      label: "Total Products",
      value: dashboardData?.totalProducts || 0,
      color: "green.500",
    },
    {
      icon: FaExclamationTriangle,
      label: "Low Stock Items",
      value: dashboardData?.lowStockItems || 0,
      color: "orange.500",
    },
    {
      icon: FaLayerGroup,
      label: "Categories",
      value: dashboardData?.totalCategories || 0,
      color: "blue.500",
    },
    {
      icon: FaMoneyBillWave,
      label: "Pending Payments",
      value: dashboardData?.pendingPayments || 0,
      color: "yellow.500",
    },
    {
      icon: FaChartLine,
      label: "Monthly Expenses",
      value: `Rs ${(dashboardData?.monthlyRevenue || 0).toLocaleString()}`,
      color: "purple.500",
    },
  ];

  if (loading) {
    return (
      <Flex bg={bgColor} minH="100vh" p={4}>
        <Sidebar />
        <Box flex={1} display="flex" alignItems="center" justifyContent="center">
          <Spinner size="xl" />
        </Box>
      </Flex>
    );
  }

  return (
    <Flex bg={bgColor} minH="100vh" p={4}>
      <Sidebar />
      <VStack flex={1} p={6} spacing={6}>
        <Flex w="full" justify="space-between" align="center">
          <HStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Dashboard
            </Text>
          </HStack>
          <HStack spacing={4}>
            <IconButton
              icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
              onClick={toggleColorMode}
              aria-label="Toggle Theme"
              variant="ghost"
              color={textColor}
              _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
            />
            <Avatar name="Ann Lee" />
          </HStack>
        </Flex>

        <Flex w="full" justify="space-between" gap={6} flexWrap="wrap">
          {stats.map((stat, index) => (
            <VStack
              key={index}
              bg={cardBgColor}
              p={6}
              rounded="md"
              boxShadow="md"
              flex="1"
              minW="200px"
              _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
            >
              <stat.icon size={30} color={stat.color} />
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                {stat.label}
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color={stat.color}>
                {stat.value}
              </Text>
            </VStack>
          ))}
        </Flex>
        
        <Flex w="full" gap={6} flexDirection={{ base: "column", lg: "row" }}>
          <Box
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            flex="1"
            minH="400px"
          >
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Inventory Overview
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            flex="1"
            minH="400px"
          >
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Order Trends
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Flex>

        <Flex w="full" gap={6} flexDirection={{ base: "column", lg: "row" }}>
        
          <Box
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            flex="1"
          >
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Recent Orders
            </Text>
            <Divider my={4} />
            {recentOrders.length > 0 ? (
              recentOrders.slice(0, 5).map((order, index) => (
                <Flex key={index} w="full" justify="space-between" align="center" my={2}>
                  <VStack align="start" spacing={0}>
                    <Text color={textColor}>
                      {order.items?.[0]?.item?.name || `Order #${order.orderNumber}`}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                  <Badge 
                    colorScheme={
                      order.deliveryStatus === "Delivered" ? "green" :
                      order.deliveryStatus === "Processing" ? "orange" :
                      order.deliveryStatus === "Cancelled" ? "red" : "blue"
                    }
                  >
                    {order.deliveryStatus}
                  </Badge>
                </Flex>
              ))
            ) : (
              <Text color="gray.500">No recent orders</Text>
            )}
          </Box>
        </Flex>

        <Box
          bg={cardBgColor}
          p={6}
          rounded="md"
          boxShadow="md"
          w="full"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Recent Transactions
            </Text>
          </Flex>
          
          {transactions.length > 0 ? (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Supplier</Th>
                  <Th>Date</Th>
                  <Th isNumeric>Amount</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.slice(0, 6).map((transaction, index) => (
                  <Tr key={index}>
                    <Td>
                      <HStack spacing={2}>
                        <FaArrowUp color={transaction.status === "success" ? "green" : "red"} />
                        <Text>{transaction.supplier || "Unknown Supplier"}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </Text>
                    </Td>
                    <Td isNumeric color={transaction.status === "success" ? "green.500" : "red.500"}>
                      Rs {transaction.amount?.toFixed(2)}
                    </Td>
                    <Td>
                      <Badge colorScheme={transaction.status === "success" ? "green" : "red"}>
                        {transaction.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text color="gray.500" textAlign="center" py={4}>
              No transactions found
            </Text>
          )}
        </Box>
      </VStack>
    </Flex>
  );
};

export default Dashboard;