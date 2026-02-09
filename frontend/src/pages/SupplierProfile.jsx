import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box, Flex, Text, VStack, HStack, Avatar, Spinner,
  Alert, AlertIcon, AlertTitle, AlertDescription, Grid
} from "@chakra-ui/react";
import { FaStore } from "react-icons/fa";
import SupplierSidebar from "../components/SupplierSidebar";
import SupplierItems from "../components/supplier/SupplierItems";
import SupplierOrders from "../components/supplier/SupplierOrders";

const SupplierProfile = () => {
  const { userId } = useParams();
  const [supplierData, setSupplierData] = useState(null);
    const [orders, setOrders] = useState([]); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");

useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch supplier data
        const supplierResponse = await axios.get(
          `http://localhost:5000/api/suppliers/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSupplierData(supplierResponse.data);

        // FETCH ORDERS SEPARATELY ← ADD THIS
        const ordersResponse = await axios.get(
          `http://localhost:5000/api/orders/supplier/${userId}`, // ← THIS IS THE MISSING API CALL
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(ordersResponse.data);

      } catch (error) {
        setError(error.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchSupplierData();
  }, [userId]);


  const handleItemAdded = (newItem) => {
    setSupplierData((prev) => ({
      ...prev,
      itemsSupplied: [...prev.itemsSupplied, newItem],
    }));
    setSuccess("Item added successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleItemUpdated = (updatedItem) => {
    setSupplierData((prev) => ({
      ...prev,
      itemsSupplied: prev.itemsSupplied.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      ),
    }));
    setSuccess("Item updated successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleItemDeleted = (itemId) => {
    setSupplierData((prev) => ({
      ...prev,
      itemsSupplied: prev.itemsSupplied.filter((item) => item._id !== itemId),
    }));
    setSuccess("Item deleted successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={10}>
        <Text fontSize="xl" color="red.500">
          {error}
        </Text>
      </Box>
    );
  }

  if (!supplierData) {
    return <Text>Supplier data not found</Text>;
  }

  return (
    <Flex minH="100vh">
      {/* Sidebar (fixed left) */}
      <Box
        w="250px"
        bg="gray.100"
        p={4}
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <SupplierSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </Box>

      {/* Main content */}
      <Box flex="1" p={8} bg="gray.50">
        {/* Success/Error Alerts */}
        {success && (
          <Alert status="success" mb={6} borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Dashboard Tab */}
        {activeTab === "Dashboard" && (
          <>
            <Box bg="white" p={6} borderRadius="md" boxShadow="sm" mb={8}>
              <HStack spacing={6} align="center">
                <Avatar
                  icon={<FaStore />}
                  name={supplierData.user?.username || "Supplier"}
                  size="xl"
                />
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold">
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

            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
                <Text fontWeight="bold">Total Items</Text>
                <Text fontSize="2xl">
                  {supplierData.itemsSupplied?.length || 0}
                </Text>
              </Box>
              <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
                <Text fontWeight="bold">Active Orders</Text>
                <Text fontSize="2xl">
                  {supplierData.orderHistory?.filter(
                    (o) => o.deliveryStatus !== "Delivered"
                  ).length || 0}
                </Text>
              </Box>
              <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
                <Text fontWeight="bold">Completed Orders</Text>
                <Text fontSize="2xl">
                  {supplierData.orderHistory?.filter(
                    (o) => o.deliveryStatus === "Delivered"
                  ).length || 0}
                </Text>
              </Box>
            </Grid>
          </>
        )}

        {/* Items Tab */}
        {activeTab === "Items" && (
          <SupplierItems
            items={supplierData.itemsSupplied}
            userId={userId}
            onItemAdded={handleItemAdded}
            onItemUpdated={handleItemUpdated}
            onItemDeleted={handleItemDeleted}
          />
        )}

        {/* Orders Tab */}
       {activeTab === "Orders" && (
      <SupplierOrders orders={orders} />
        )}
      </Box>
    </Flex>
  );
};

export default SupplierProfile;
