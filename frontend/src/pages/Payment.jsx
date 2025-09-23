import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Flex,
  Text,
  Button,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  useToast,
  HStack,
} from "@chakra-ui/react";
import Sidebar from "../components/sidebar";

const PaymentPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");

  // Extract fetch logic into a reusable function
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const pendingOrders = response.data.filter(
        (order) => order.paymentStatus === "Pending"
      );
      setOrders(pendingOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Format currency for LKR
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount || 0);

  // Format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handlePayment = (orderId, supplierName) => {
  navigate(`/payment/checkout/${orderId}`, { state: { supplierName } });
};

  return (
    <Flex bg={useColorModeValue("gray.50", "gray.900")} minH="100vh">
      <Sidebar />
      <Box p={6} flex={1}>
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold">
            Supplier Payments
          </Text>
          <Button size="sm" colorScheme="blue" onClick={fetchOrders}>
            Refresh
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="lg" />
          </Flex>
        ) : orders.length > 0 ? (
          <Box borderWidth={1} borderRadius="lg" p={4} bg={cardBg}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Supplier</Th>
                  <Th>Order Date</Th>
                  <Th>Total Amount</Th>
                  <Th>Payment Due Date</Th>
                  <Th>Payment Status</Th>
                  <Th textAlign="center">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order._id}>
                    <Td>{order.orderNumber}</Td>
                    <Td>
                      {order.supplier?.user?.username || "Unknown Supplier"}
                    </Td>
                    <Td>{formatDate(order.orderDate)}</Td>
                    <Td>{formatCurrency(order.orderTotal)}</Td>
                    <Td>
                      {order.paymentDueDate
                        ? formatDate(order.paymentDueDate)
                        : "N/A"}
                    </Td>
                    <Td>
                      <Badge colorScheme="orange">{order.paymentStatus}</Badge>
                    </Td>
                    <Td textAlign="center">
                      <Button
                        colorScheme="purple"
                        onClick={() =>
                          handlePayment(
                            order._id,
                            order.supplier?.user?.username || "Unknown Supplier"
                          )
                        }
                        size="sm"
                      >
                        Pay Now
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Text color="gray.500" textAlign="center" mt={4} fontStyle="italic">
            No pending orders available
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default PaymentPage;
