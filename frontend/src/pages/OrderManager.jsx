import {
  Box,
  Flex,
  Text,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Button,
  useColorModeValue,
  useToast,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

const OrdersPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
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
    };

    fetchOrders();
  }, [toast]);

  const handleAddOrder = () => {
    navigate("/orders/new");
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.deliveryStatus === statusFilter);

  if (loading) {
    return (
      <Flex bg={bgColor} minH="100vh">
        <Sidebar />
        <Box p={6} flex={1} display="flex" alignItems="center" justifyContent="center">
          <Spinner size="xl" />
        </Box>
      </Flex>
    );
  }

  return (
    <Flex bg={bgColor} minH="100vh">
      <Sidebar />
      <Box p={6} flex={1}>
        {/* Header row */}
        <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            Orders
          </Text>
          <HStack spacing={4}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              bg={cardBg}
              w="180px"
            >
              <option value="All">All</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="purple"
              onClick={handleAddOrder}
            >
              Add New Order
            </Button>
          </HStack>
        </Flex>

        {/* Table */}
        <Box borderWidth={1} borderRadius="lg" p={4} bg={cardBg}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Product</Th>
                <Th>Supplier</Th>
                <Th>Quantity</Th>
                <Th>Order Date</Th>
                <Th>Status</Th>
                <Th textAlign="center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Tr key={order._id}>
                    <Td>{order.orderNumber}</Td>
                    <Td>{order.items[0]?.item?.name || "N/A"}</Td>
                     <Td>{order.supplier?.user?.username || "N/A"}</Td>                    
                     <Td>{order.items[0]?.quantity || "N/A"}</Td>
                    <Td>{new Date(order.orderDate).toLocaleDateString()}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          order.deliveryStatus === "Delivered" 
                            ? "green" 
                            : order.deliveryStatus === "Cancelled" 
                            ? "red" 
                            : order.deliveryStatus === "Shipped"
                            ? "blue"
                            : "orange"
                        }
                      >
                        {order.deliveryStatus}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2} justify="center">
                        <IconButton
                          icon={<FaEdit />}
                          aria-label="Edit Order"
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                        />
                        <IconButton
                          icon={<FaTrashAlt />}
                          aria-label="Delete Order"
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center">
                    No orders found.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Flex>
  );
};

export default OrdersPage;