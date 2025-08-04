import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Select,
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
    supplier: "",
    price: "",
    stockLevel: "",
    expirationDate: "",
    reorderThreshold: "",
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
      const payload = {
        name: formData.name,
        category: formData.category,
        supplier: formData.supplier,
        price: parseFloat(formData.price),
        stockLevel: parseInt(formData.stockLevel),
        expirationDate: formData.expirationDate,
        reorderThreshold: parseInt(formData.reorderThreshold),
        draft,
      };

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
        supplier: "",
        price: "",
        stockLevel: "",
        expirationDate: "",
        reorderThreshold: "",
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
                <option value="">Select</option>
                <option value="Beverages">Beverages</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Fruits">Fruits</option>
                <option value="Bakery">Bakery</option>
                <option value="Dairy">Dairy</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Supplier</FormLabel>
              <Input name="supplier" value={formData.supplier} onChange={handleInputChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
              />
            </FormControl>
          </VStack>
        </GridItem>

        {/* Right Column */}
        <GridItem>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Stock Level</FormLabel>
              <Input
                name="stockLevel"
                type="number"
                value={formData.stockLevel}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Reorder Threshold</FormLabel>
              <Input
                name="reorderThreshold"
                type="number"
                value={formData.reorderThreshold}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Expiration Date</FormLabel>
              <HStack>
                <IconButton icon={<FaCalendarAlt />} aria-label="Select Date" />
                <Input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                />
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>Product Image (Optional)</FormLabel>
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
