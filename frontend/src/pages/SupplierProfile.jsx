import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box, Flex, Text, VStack, HStack, Avatar, Badge, 
  Grid, GridItem, Spinner, useColorModeValue,
  Alert, AlertIcon, AlertTitle, AlertDescription
} from "@chakra-ui/react";
import { FaStore } from "react-icons/fa";
import SupplierSidebar from "../components/SupplierSidebar";
import SupplierItems from "../components/supplier/SupplierItems";
import SupplierOrders from "../components/supplier/SupplierOrders";

const SupplierProfile = () => {
  const { userId } = useParams();
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/suppliers/user/${userId}`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            } 
          }
        );
        setSupplierData(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load supplier data");
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [userId]);

  const handleItemAdded = (newItem) => {
    setSupplierData(prev => ({
      ...prev,
      itemsSupplied: [...prev.itemsSupplied, newItem]
    }));
    setSuccess("Item added successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleItemUpdated = (updatedItem) => {
    setSupplierData(prev => ({
      ...prev,
      itemsSupplied: prev.itemsSupplied.map(item => 
        item._id === updatedItem._id ? updatedItem : item
      )
    }));
    setSuccess("Item updated successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleItemDeleted = (itemId) => {
    setSupplierData(prev => ({
      ...prev,
      itemsSupplied: prev.itemsSupplied.filter(item => item._id !== itemId)
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
      {/* Sidebar */}
      <SupplierSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      
      {/* Main Content */}
      <GridItem ml="250px" p={6}>
        {/* Success/Error Alerts */}
        {success && (
          <Alert status="success" mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Dashboard Tab */}
        {activeTab === "Dashboard" && (
          <>
            <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md" mb={6}>
              <HStack spacing={4}>
                <Avatar 
                  icon={<FaStore />} 
                  name={supplierData.user?.username || 'Supplier'} 
                  size="xl" 
                />
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {supplierData.user?.username || 'N/A'}
                  </Text>
                  <Text>{supplierData.user?.email || 'N/A'}</Text>
                  <Text>Phone: {supplierData.phoneNumber || 'N/A'}</Text>
                  <Text>Address: {supplierData.address || 'N/A'}</Text>
                  <Text>
                    Member since: {supplierData.user?.createdAt ? 
                      new Date(supplierData.user.createdAt).toLocaleDateString() : 
                      'N/A'
                    }
                  </Text>
                </VStack>
              </HStack>
            </Box>

            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              <Box bg={cardBg} p={4} borderRadius="md" boxShadow="md">
                <Text fontWeight="bold">Total Items</Text>
                <Text fontSize="2xl">{supplierData.itemsSupplied?.length || 0}</Text>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="md" boxShadow="md">
                <Text fontWeight="bold">Active Orders</Text>
                <Text fontSize="2xl">
                  {supplierData.orderHistory?.filter(o => o.deliveryStatus !== "Delivered").length || 0}
                </Text>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="md" boxShadow="md">
                <Text fontWeight="bold">Completed Orders</Text>
                <Text fontSize="2xl">
                  {supplierData.orderHistory?.filter(o => o.deliveryStatus === "Delivered").length || 0}
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
          <SupplierOrders orders={supplierData.orderHistory} />
        )}
      </GridItem>
    </Grid>
  );
};

export default SupplierProfile;