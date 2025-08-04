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

// Mock data (replace with backend later)
const orders = [
  {
    id: "ORD-001",
    product: "Samaposha 700g",
    customer: "Liam Wang",
    date: "2025-06-23",
    status: "Pending",
  },
  {
    id: "ORD-002",
    product: "Chocolate Box",
    customer: "Nimal Perera",
    date: "2025-06-22",
    status: "Completed",
  },
  {
    id: "ORD-003",
    product: "SunSilk Shampoo 100ml",
    customer: "Anya Lee",
    date: "2025-06-21",
    status: "Pending",
  },
];

const OrdersPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState("All");

  const bgColor = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  const handleAddOrder = () => {
    navigate("/orders/new");
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

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
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
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
                <Th>Customer</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th textAlign="center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <Tr key={idx}>
                    <Td>{order.id}</Td>
                    <Td>{order.product}</Td>
                    <Td>{order.customer}</Td>
                    <Td>{order.date}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          order.status === "Completed" ? "green" : "orange"
                        }
                      >
                        {order.status}
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
                  <Td colSpan={6} textAlign="center">
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
