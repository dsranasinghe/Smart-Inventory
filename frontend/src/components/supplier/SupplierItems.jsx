import { useState } from "react";
import {
  Box, Flex, Text, Table, Thead, Tbody, Tr, Th, Td,
  Badge, Button, useColorModeValue, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, FormControl, FormLabel, Input, ModalFooter, Select,
  Alert, AlertIcon, AlertTitle, AlertDescription
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";

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

  const cardBg = useColorModeValue("white", "gray.700");

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
    <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
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

      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">Items Supplied</Text>
        <Button colorScheme="blue" onClick={onOpen}>
          Add New Item
        </Button>
      </Flex>
      
      {items?.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Item Name</Th>
              <Th>Description</Th>
              <Th>Price</Th>
              <Th>Delivery</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr key={item._id}>
                <Td>{item.name}</Td>
                <Td>{item.description}</Td>
                <Td>${item.unitPrice}</Td>
                <Td>{item.deliveryType}</Td>
                <Td>
                  <Badge colorScheme={item.inStock ? "green" : "red"}>
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </Td>
                <Td>
                  <Button 
                    size="sm" 
                    colorScheme="blue" 
                    mr={2}
                    leftIcon={<FaEdit />}
                    onClick={() => openEditModal(item)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    colorScheme="red" 
                    leftIcon={<FaTrash />}
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>No items supplied yet</Text>
      )}

      {/* Add Item Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Item Name</FormLabel>
              <Input 
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Enter item name"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input 
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="Enter description"
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Unit Price ($)</FormLabel>
              <Input 
                type="number"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({...newItem, unitPrice: e.target.value})}
                placeholder="Enter price"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Delivery Type</FormLabel>
              <Select
                value={newItem.deliveryType}
                onChange={(e) => setNewItem({...newItem, deliveryType: e.target.value})}
              >
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
                <option value="Overnight">Overnight</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Stock Status</FormLabel>
              <Select
                value={newItem.inStock}
                onChange={(e) => setNewItem({...newItem, inStock: e.target.value === "true"})}
              >
                <option value={true}>In Stock</option>
                <option value={false}>Out of Stock</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddItem}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Item Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {editingItem && (
              <>
                <FormControl isRequired>
                  <FormLabel>Item Name</FormLabel>
                  <Input 
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Input 
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Unit Price ($)</FormLabel>
                  <Input 
                    type="number"
                    value={editingItem.unitPrice}
                    onChange={(e) => setEditingItem({...editingItem, unitPrice: e.target.value})}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Delivery Type</FormLabel>
                  <Select
                    value={editingItem.deliveryType}
                    onChange={(e) => setEditingItem({...editingItem, deliveryType: e.target.value})}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                    <option value="Overnight">Overnight</option>
                  </Select>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Stock Status</FormLabel>
                  <Select
                    value={editingItem.inStock}
                    onChange={(e) => setEditingItem({...editingItem, inStock: e.target.value === "true"})}
                  >
                    <option value={true}>In Stock</option>
                    <option value={false}>Out of Stock</option>
                  </Select>
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditItem}>
              Save Changes
            </Button>
            <Button onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SupplierItems;