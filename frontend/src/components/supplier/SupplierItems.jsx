import { useState } from "react";
import axios from "axios";
import {
  Box, Flex, Text, Button, useColorModeValue, useDisclosure,
  SimpleGrid
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

import ItemCard from "../Items/ItemCard";
import EmptyState from "../Items/EmptyState";
import ItemFormModal from "../Items/ItemFormModal";
import AlertMessage from "../Items/AlertMessage";

const SupplierItems = ({ items, userId, onItemAdded, onItemUpdated, onItemDeleted }) => {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    unitPrice: "",
    category: "",         // ✅ Added category
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
      category: "",       // ✅ Reset category too
      deliveryType: "Standard",
      inStock: true
    });
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    onEditOpen();
  };

  const handleItemChange = (field, value) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    } else {
      setNewItem({ ...newItem, [field]: value });
    }
  };

  return (
    <Box
      bg={cardBg}
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      width="550px"
      maxWidth="1400px"
      mx="auto"
    >
      {/* Success/Error Alerts */}
      {success && (
        <AlertMessage 
          status="success"
          title="Success!"
          message={success}
        />
      )}
      {error && (
        <AlertMessage 
          status="error"
          title="Error!"
          message={error}
        />
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
          spacing={10}
          width="100%"
          mb={4}
          minChildWidth="250px"
        >
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onEdit={openEditModal}
              onDelete={handleDeleteItem}
              cardBg={cardBg}
              textColor={textColor}
              borderColor={borderColor}
              hoverBorderColor={hoverBorderColor}
            />
          ))}
        </SimpleGrid>
      ) : (
        <EmptyState 
          onAddItem={onOpen}
          bg={emptyStateBg}
          borderColor={useColorModeValue("gray.300", "gray.500")}
        />
      )}

      {/* Add Item Modal */}
      <ItemFormModal
        isOpen={isOpen}
        onClose={onClose}
        item={newItem}
        onChange={handleItemChange}
        onSubmit={handleAddItem}
        title="Add New Item"
        submitButtonText="Save Item"
        borderColor={borderColor}
      />

      {/* Edit Item Modal */}
      <ItemFormModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        item={editingItem || {}}
        onChange={handleItemChange}
        onSubmit={handleEditItem}
        title="Edit Item"
        submitButtonText="Save Changes"
        borderColor={borderColor}
      />
    </Box>
  );
};

export default SupplierItems;
