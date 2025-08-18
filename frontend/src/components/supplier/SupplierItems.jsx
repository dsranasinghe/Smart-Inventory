import { useState } from "react";
import axios from "axios";
import {
  Box, Flex, Text, Badge, Button, useColorModeValue, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, FormControl, FormLabel, Input, ModalFooter, Select,
  Alert, AlertIcon, AlertTitle, AlertDescription, VStack, HStack, 
  SimpleGrid, Icon, Center
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaBoxOpen, FaPlus } from "react-icons/fa";

const SupplierItems = ({ items, userId, onItemAdded, onItemUpdated, onItemDeleted }) => {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    unitPrice: "",
    deliveryType: "Standard",
    inStock: true
  });
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  // Color mode values
  const cardBg = useColorModeValue("white", "gray.800");
  const emptyStateBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBorderColor = useColorModeValue("blue.200", "blue.300");

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/suppliers/${userId}/items`,
        newItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onItemAdded(response.data);
      setSuccess("Item added successfully!");
      setTimeout(() => setSuccess(null), 3000);
      onClose();
      resetItemForm();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add item");
    }
  };

  const handleEditItem = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/suppliers/${userId}/items/${editingItem._id}`,
        editingItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onItemUpdated(response.data);
      setSuccess("Item updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      onEditClose();
      setEditingItem(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/suppliers/${userId}/items/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onItemDeleted(itemId);
      setSuccess("Item deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete item");
    }
  };

  const resetItemForm = () => {
    setNewItem({
      name: "",
      description: "",
      unitPrice: "",
      deliveryType: "Standard",
      inStock: true
    });
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    onEditOpen();
  };

  return (
    <Box
      bg={cardBg}
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      width="100%"
      maxWidth="1400px"
      mx="auto"
    >
      {/* Success/Error Alerts */}
      {success && (
        <Alert 
          status="success" 
          mb={6} 
          borderRadius="lg" 
          variant="left-accent"
          alignItems="flex-start"
        >
          <AlertIcon mt={1} />
          <Box>
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Box>
        </Alert>
      )}
      {error && (
        <Alert 
          status="error" 
          mb={6} 
          borderRadius="lg" 
          variant="left-accent"
          alignItems="flex-start"
        >
          <AlertIcon mt={1} />
          <Box>
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      )}

      {/* Header with Add Button */}
      <Flex justify="space-between" align="center" mb={8}>
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Items Supplied
        </Text>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="blue"
          onClick={onOpen}
          size="md"
          borderRadius="md"
          boxShadow="sm"
          _hover={{ 
            transform: "translateY(-2px)",
            boxShadow: "md"
          }}
          transition="all 0.2s"
        >
          Add New Item
        </Button>
      </Flex>

      {/* Items Grid */}
      {items?.length > 0 ? (
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={6}
          width="100%"
        >
          {items.map((item) => (
            <Box
              key={item._id}
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="md"
              border="1px solid"
              borderColor={borderColor}
              transition="all 0.2s"
              _hover={{ 
                transform: "translateY(-5px)",
                boxShadow: "xl",
                borderColor: hoverBorderColor
              }}
              height="100%"
            >
              <VStack align="start" spacing={4} height="100%">
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  {item.name}
                </Text>
                
                {item.description && (
                  <Text 
                    color={useColorModeValue("gray.600", "gray.300")}
                    fontSize="sm"
                  >
                    {item.description}
                  </Text>
                )}
                
                <HStack spacing={4} mt={2}>
                  <Text fontWeight="semibold">${item.unitPrice}</Text>
                  <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
                    {item.deliveryType} delivery
                  </Text>
                </HStack>
                
                <Badge
                  colorScheme={item.inStock ? "green" : "red"}
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                  alignSelf="flex-start"
                  mt={2}
                >
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
                
                <HStack spacing={3} pt={4} mt="auto">
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    leftIcon={<FaEdit />}
                    onClick={() => openEditModal(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    leftIcon={<FaTrash />}
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    Delete
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Center
          bg={emptyStateBg}
          p={12}
          borderRadius="xl"
          flexDirection="column"
          textAlign="center"
          border="2px dashed"
          borderColor={useColorModeValue("gray.300", "gray.500")}
          minH="300px"
          width="100%"
        >
          <Icon 
            as={FaBoxOpen} 
            boxSize={10} 
            mb={4} 
            color={useColorModeValue("gray.400", "gray.500")} 
          />
          <Text fontSize="xl" fontWeight="medium" color="gray.500" mb={2}>
            No items supplied yet
          </Text>
          <Text 
            color={useColorModeValue("gray.500", "gray.400")} 
            mb={4}
            maxWidth="400px"
          >
            Get started by adding your first product to inventory
          </Text>
          <Button
            colorScheme="blue"
            leftIcon={<FaPlus />}
            onClick={onOpen}
            size="md"
            mt={2}
          >
            Add First Item
          </Button>
        </Center>
      )}

      {/* Add Item Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader 
            borderBottom="1px solid" 
            borderColor={borderColor}
            fontSize="xl"
          >
            Add New Item
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel>Item Name</FormLabel>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter item name"
                  size="lg"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter description (optional)"
                  size="lg"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Unit Price ($)</FormLabel>
                <Input
                  type="number"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                  placeholder="0.00"
                  size="lg"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Delivery Type</FormLabel>
                <Select
                  value={newItem.deliveryType}
                  onChange={(e) => setNewItem({ ...newItem, deliveryType: e.target.value })}
                  size="lg"
                  focusBorderColor="blue.500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Overnight">Overnight</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Stock Status</FormLabel>
                <Select
                  value={newItem.inStock}
                  onChange={(e) => setNewItem({ ...newItem, inStock: e.target.value === "true" })}
                  size="lg"
                  focusBorderColor="blue.500"
                >
                  <option value={true}>In Stock</option>
                  <option value={false}>Out of Stock</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter 
            borderTop="1px solid" 
            borderColor={borderColor}
            pt={4}
          >
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleAddItem}
              size="lg"
              px={6}
            >
              Save Item
            </Button>
            <Button 
              onClick={onClose}
              variant="ghost"
              size="lg"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Item Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader 
            borderBottom="1px solid" 
            borderColor={borderColor}
            fontSize="xl"
          >
            Edit Item
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            {editingItem && (
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    size="lg"
                    focusBorderColor="blue.500"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    size="lg"
                    focusBorderColor="blue.500"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Unit Price ($)</FormLabel>
                  <Input
                    type="number"
                    value={editingItem.unitPrice}
                    onChange={(e) => setEditingItem({ ...editingItem, unitPrice: e.target.value })}
                    size="lg"
                    focusBorderColor="blue.500"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Delivery Type</FormLabel>
                  <Select
                    value={editingItem.deliveryType}
                    onChange={(e) => setEditingItem({ ...editingItem, deliveryType: e.target.value })}
                    size="lg"
                    focusBorderColor="blue.500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                    <option value="Overnight">Overnight</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Stock Status</FormLabel>
                  <Select
                    value={editingItem.inStock}
                    onChange={(e) => setEditingItem({ ...editingItem, inStock: e.target.value === "true" })}
                    size="lg"
                    focusBorderColor="blue.500"
                  >
                    <option value={true}>In Stock</option>
                    <option value={false}>Out of Stock</option>
                  </Select>
                </FormControl>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter 
            borderTop="1px solid" 
            borderColor={borderColor}
            pt={4}
          >
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleEditItem}
              size="lg"
              px={6}
            >
              Save Changes
            </Button>
            <Button 
              onClick={onEditClose}
              variant="ghost"
              size="lg"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SupplierItems;