import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useColorModeValue,
  Spinner // Added Spinner import
} from "@chakra-ui/react";
import { FaStore } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SupplierProfile = () => {
  const { userId } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

useEffect(() => {
  const fetchSupplier = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/suppliers/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSupplier(response.data);
    } catch (error) {
      console.error("Error fetching supplier:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSupplier();
}, [userId]);

  if (loading) return <Flex justify="center"><Spinner size="xl" /></Flex>;
  if (!supplier) return <Text>Supplier not found</Text>;

  return (
    <Box p={6}>
      <Flex direction="column" gap={6}>
        {/* Supplier Info */}
        <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
          <HStack spacing={4}>
            <Avatar icon={<FaStore />} name={supplier.user?.username} size="xl" />
            <VStack align="start" spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                {supplier.user?.username || 'N/A'}
              </Text>
              <Text>{supplier.user?.email || 'N/A'}</Text>
              <Text>Phone: {supplier.phoneNumber || 'N/A'}</Text>
              <Text>Address: {supplier.address || 'N/A'}</Text>
              <Text>Member since: {supplier.user?.createdAt ? new Date(supplier.user.createdAt).toLocaleDateString() : 'N/A'}</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Items Supplied */}
        <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Items Supplied</Text>
          {supplier.itemsSupplied?.length > 0 ? (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Item Name</Th>
                  <Th>Delivery Type</Th>
                  <Th>Unit Price</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {supplier.itemsSupplied.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.name}</Td>
                    <Td>{item.deliveryType}</Td>
                    <Td>${item.unitPrice}</Td>
                    <Td>
                      <Badge colorScheme={item.inStock ? "green" : "red"}>
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </Td>
                    <Td>
                      <Button size="sm" colorScheme="blue">Order</Button>
                      <Button size="sm" ml={2}>View Details</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>No items supplied yet</Text>
          )}
        </Box>

        {/* Order History */}
        <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Order History</Text>
          {supplier.orderHistory?.length > 0 ? (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Order Date</Th>
                  <Th>Delivery Type</Th>
                  <Th>Tracking ID</Th>
                  <Th>Total</Th>
                  <Th>Payment Status</Th>
                  <Th>Delivery Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {supplier.orderHistory.map((order, index) => (
                  <Tr key={index}>
                    <Td>{new Date(order.orderDate).toLocaleString()}</Td>
                    <Td>{order.deliveryType}</Td>
                    <Td>{order.trackingId}</Td>
                    <Td>${order.orderTotal}</Td>
                    <Td>
                      <Badge colorScheme={order.paymentStatus === "Completed" ? "green" : "orange"}>
                        {order.paymentStatus}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={order.deliveryStatus === "Shipped" ? "green" : "blue"}>
                        {order.deliveryStatus}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>No order history yet</Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default SupplierProfile;