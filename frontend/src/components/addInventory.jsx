import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  Textarea,
  Grid,
  GridItem,
  IconButton,
  Image,
  useToast,
  FormControl,
  FormLabel,
  Flex,
  Divider,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { FaUpload, FaTrash, FaCalendarAlt } from "react-icons/fa";

const InventoryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sellingPrice: "",
    costPrice: "",
    stockQuantity: "",
    orderType: "",
    supplier: "",
    dateAdded: "",
    description: "",
    image: null,
  });

  const toast = useToast();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (draft = false) => {
    try {
      const payload = { ...formData, draft };
      const response = await fetch("http://localhost:5000/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save inventory item");

      toast({
        title: draft ? "Saved as Draft" : "Published Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        name: "",
        category: "",
        sellingPrice: "",
        costPrice: "",
        stockQuantity: "",
        orderType: "",
        supplier: "",
        dateAdded: "",
        description: "",
        image: null,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="1200px" mx="auto" p={8} bg="white" borderRadius="lg" boxShadow="md">
      <Heading size="lg" mb={6} textAlign="center" color="purple.600">
        Add Inventory Item
      </Heading>
      <Divider mb={6} />

      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        {/* Left Column */}
        <GridItem>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleInputChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Bakery">Bakery</option>
                <option value="Beverages">Beverages</option>
                <option value="Dairy">Dairy</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Selling Price</FormLabel>
              <Input name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Cost Price</FormLabel>
              <Input name="costPrice" value={formData.costPrice} onChange={handleInputChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Stock Quantity</FormLabel>
              <Input name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} />
            </FormControl>
          </VStack>
        </GridItem>

        {/* Right Column */}
        <GridItem>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Order Type</FormLabel>
              <Input name="orderType" value={formData.orderType} onChange={handleInputChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Supplier</FormLabel>
              <Select name="supplier" value={formData.supplier} onChange={handleInputChange}>
                <option value="Fresh Farms">Fresh Farms</option>
                <option value="Local Market">Local Market</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Short Description</FormLabel>
              <Textarea name="description" value={formData.description} onChange={handleInputChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Date Added</FormLabel>
              <HStack>
                <IconButton icon={<FaCalendarAlt />} aria-label="Select Date" />
                <Input type="date" name="dateAdded" value={formData.dateAdded} onChange={handleInputChange} />
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>Product Image</FormLabel>
              <Box p={4} border="2px dashed gray" borderRadius="md" textAlign="center">
                {formData.image ? (
                  <Image src={formData.image} boxSize="150px" borderRadius="md" mx="auto" mb={2} />
                ) : (
                  "No Image Uploaded"
                )}
                <HStack justifyContent="center" mt={2}>
                  <Button leftIcon={<FaUpload />} as="label">
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                    Upload Image
                  </Button>
                  {formData.image && (
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Remove Image"
                      onClick={() => setFormData({ ...formData, image: null })}
                    />
                  )}
                </HStack>
              </Box>
            </FormControl>
          </VStack>
        </GridItem>
      </Grid>

      {/* Buttons */}
      <Flex mt={8} justifyContent="flex-end" gap={4}>
        <Button colorScheme="purple" variant="outline" onClick={() => handleSubmit(true)}>
          Save as Draft
        </Button>
        <Button colorScheme="purple" onClick={() => handleSubmit(false)}>
          Save & Publish
        </Button>
      </Flex>
    </Box>
  );
};

export default InventoryForm;