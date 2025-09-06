import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useColorModeValue,
  useToast,
  Text,
  Flex,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import axios from "axios";

const NewOrderPage = () => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    quantity: "",
    supplier: "",
    description: "",
    expectedDate: "",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [supplierItems, setSupplierItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);

  const orderDate = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/suppliers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast({
          title: "Error",
          description: "Failed to fetch suppliers",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setSuppliersLoading(false);
      }
    };

    fetchSuppliers();
  }, [toast]);

  // Fetch supplier items when supplier is selected
  useEffect(() => {
    const fetchSupplierItems = async () => {
      if (!formData.supplier) {
        setSupplierItems([]);
        return;
      }

      setItemsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/suppliers/${formData.supplier}/items`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSupplierItems(response.data);
      } catch (error) {
        console.error("Error fetching supplier items:", error);
        toast({
          title: "Error",
          description: "Failed to fetch supplier items",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setItemsLoading(false);
      }
    };

    fetchSupplierItems();
  }, [formData.supplier, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const selectedItem = supplierItems.find(
        (item) => String(item._id) === String(formData.productName)
      );

      const unitPrice = selectedItem.unitPrice;
      if (!selectedItem) {
        throw new Error("Please select a valid product");
      }

      const quantity = parseInt(formData.quantity);
      const orderTotal = unitPrice * quantity;

      const orderData = {
        items: [
          {
            item: formData.productName,
            quantity: quantity,
            unitPriceAtOrder: unitPrice,
          },
        ],
        orderTotal: orderTotal, 
        description: formData.description,
        expectedDeliveryDate: formData.expectedDate,
        supplier: formData.supplier,
      };

      console.log("Order data being sent:", orderData);
      await axios.post(`http://localhost:5000/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Order Submitted",
        description: "The order has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
       // Redirect to payment page if payment status is pending
    if (response.data.paymentStatus === 'Pending') {
      navigate(`/payment/checkout/${response.data._id}`);
    } else {
      navigate("/orders");
    }
  } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit order",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const cardBg = useColorModeValue("white", "gray.700");
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const labelColor = useColorModeValue("gray.700", "white");

  return (
    <Flex bg={bgColor} minH="100vh" p={4}>
      <Sidebar />
      <Box
        flex={1}
        p={6}
        maxW="1000px"
        mx="auto"
        bg={cardBg}
        rounded="md"
        boxShadow="md"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Add New Order
        </Text>
        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel color={labelColor}>Supplier</FormLabel>
                {suppliersLoading ? (
                  <Spinner />
                ) : (
                  <Select
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="Select supplier"
                  >
                    {suppliers.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.username}
                      </option>
                    ))}
                  </Select>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Product</FormLabel>
                {itemsLoading ? (
                  <Spinner />
                ) : (
                  <Select
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Select product"
                    isDisabled={!formData.supplier}
                  >
                    {supplierItems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} - ${item.price}
                      </option>
                    ))}
                  </Select>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Product Category</FormLabel>
                <Input
                  value={
                    supplierItems.find(
                      (item) =>
                        String(item._id) === String(formData.productName)
                    )?.category || ""
                  }
                  isReadOnly
                  placeholder="Category will auto-fill"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Quantity</FormLabel>
                <Input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  min="1"
                />
              </FormControl>
            </VStack>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel color={labelColor}>Order Date</FormLabel>
                <Input type="date" value={orderDate} isReadOnly />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Expected Delivery Date</FormLabel>
                <Input
                  type="date"
                  name="expectedDate"
                  value={formData.expectedDate}
                  onChange={handleChange}
                  min={orderDate}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Unit Price</FormLabel>
                <Input
                  value={
                    supplierItems.find(
                      (item) =>
                        String(item._id) === String(formData.productName)
                    )?.unitPrice || ""
                  }
                  isReadOnly
                  placeholder="Price will auto-fill"
                />
              </FormControl>
            </VStack>
          </SimpleGrid>

          <Button
            type="submit"
            colorScheme="blue"
            mt={6}
            isLoading={loading}
            isDisabled={
              !formData.supplier ||
              !formData.productName ||
              !formData.quantity ||
              !formData.expectedDate
            }
          >
            Submit Order
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default NewOrderPage;
