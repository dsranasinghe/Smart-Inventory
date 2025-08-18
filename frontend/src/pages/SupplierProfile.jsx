import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
  Spinner,
  Grid, 
  GridItem
} from "@chakra-ui/react";
import { FaStore } from "react-icons/fa";
import SupplierSidebar from "../components/SupplierSidebar";

const SupplierProfile = () => {
  const { userId } = useParams();
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const [activeTab, setActiveTab] = useState("Dashboard");


  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch supplier profile only (this includes user info via populate)
        const supplierResponse = await axios.get(
          `http://localhost:5000/api/suppliers/user/${userId}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        setSupplierData(supplierResponse.data);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [userId]);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={10}>
        <Text fontSize="xl" color="red.500">{error}</Text>
        <Button mt={4} onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!supplierData) {
    return <Text>Supplier data not found</Text>;
  }

  return (
  <Grid templateColumns="250px 1fr" minH="100vh">
    {/* Sidebar Column */}
    <GridItem>
      <SupplierSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
    </GridItem>
    
    {/* Main Content Column */}
    <GridItem ml="250px" p={6}>
      <Flex direction="column" gap={6}>
        {/* Supplier Info */}
        <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
          <HStack spacing={4}>
            <Avatar icon={<FaStore />} name={supplierData.user?.username} size="xl" />
            <VStack align="start" spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                {supplierData.user?.username || "N/A"}
              </Text>
              <Text>{supplierData.user?.email || "N/A"}</Text>
              <Text>Phone: {supplierData.phoneNumber || "N/A"}</Text>
              <Text>Address: {supplierData.address || "N/A"}</Text>
              <Text>
                Member since:{" "}
                {supplierData.user?.createdAt
                  ? new Date(supplierData.user.createdAt).toLocaleDateString()
                  : "N/A"}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Items Supplied */}
        <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Items Supplied</Text>
          {supplierData.itemsSupplied?.length > 0 ? (
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
                {supplierData.itemsSupplied.map((item, index) => (
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
          {supplierData.orderHistory?.length > 0 ? (
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
                {supplierData.orderHistory.map((order, index) => (
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
    </GridItem>
  </Grid>
);
};

export default SupplierProfile;
