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
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

const NewOrderPage = () => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    quantity: "",
    supplier: "",
    description: "",
    expectedDate: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...formData, orderDate });
    toast({
      title: "Order Submitted",
      description: "The order has been added successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/orders");
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
                <FormLabel color={labelColor}>Product Name</FormLabel>
                <Input
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Product Category</FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Select category"
                >
                  <option value="Groceries">Groceries</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Beverages">Beverages</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Quantity</FormLabel>
                <Input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Supplier</FormLabel>
                <Select
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Select supplier"
                >
                  <option value="Lanka Traders">Lanka Traders</option>
                  <option value="Browns & Co.">Browns & Co.</option>
                  <option value="Unilever Distributors">Unilever Distributors</option>
                </Select>
              </FormControl>
            </VStack>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel color={labelColor}>Short Description (Optional)</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add any notes or details..."
                  rows={5}
                />
              </FormControl>

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
                />
              </FormControl>
            </VStack>
          </SimpleGrid>

          <Button type="submit" colorScheme="blue" mt={6}>
            Submit Order
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default NewOrderPage;
