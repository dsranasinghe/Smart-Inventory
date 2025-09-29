import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Custom filter components
import SearchFilter from "../components/search";
import StatusFilter from "../components/statusfilter";
import DateFilter from "../components/datefilter";
import InventoryHeader from "../components/InventoryHeader";

// Status thresholds
const getStatus = (stockLevel, reorderThreshold) => {
  if (stockLevel <= 0) return "Out of Stock";
  if (stockLevel <= reorderThreshold) return "Low Stock";
  return "In Stock";
};

const statusColors = {
  "In Stock": "blue",
  "Low Stock": "yellow",
  "Out of Stock": "red",
  "Expiring Soon": "orange",
};

export default function InventoryView() {
  const navigate = useNavigate();
  const toast = useToast();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expirationFilter, setExpirationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Fetch inventory data from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/inventory");
        setInventoryItems(response.data);
        
        // Log categories to debug
        const categories = [...new Set(response.data.map(item => item.category))];
        console.log("Available categories in database:", categories);
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error loading inventory",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    onOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${itemToDelete}`);
      setInventoryItems(prevItems =>
        prevItems.filter(item => item._id !== itemToDelete)
      );
      toast({
        title: "Inventory deleted",
        description: "Inventory item has been removed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error deleting item",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const itemStatus = getStatus(item.stockLevel, item.reorderThreshold);
    const matchesStatus = statusFilter === "All" || itemStatus === statusFilter;

    const matchesDate =
      !expirationFilter ||
      item.expirationDate?.startsWith(expirationFilter);
      
    const matchesCategory = categoryFilter === "All" || 
                            item.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDate && matchesCategory;
  });

  if (loading) {
    return (
      <Flex>
        <Sidebar />
        <Box p={6} flex={1} display="flex" justifyContent="center" alignItems="center">
          <Spinner size="xl" />
        </Box>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex>
        <Sidebar />
        <Box p={6} flex={1} textAlign="center">
          <Text color="red.500">Error loading inventory: {error}</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex>
      <Sidebar />
      <Box p={6} flex={1}>
        {/* Header Buttons */}
        <InventoryHeader 
          selectedCategory={categoryFilter} 
          onCategoryChange={setCategoryFilter} 
        />

        {/* Filters */}
        <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={4}>
          <SearchFilter value={searchTerm} onChange={setSearchTerm} />
          <StatusFilter selected={statusFilter} onChange={setStatusFilter} />
          <DateFilter date={expirationFilter} onChange={setExpirationFilter} />
        </Flex>

        {/* Table */}
        <Box borderWidth={1} borderRadius="lg" p={4}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Product Name</Th>
                <Th>Category</Th>
                <Th>Supplier</Th>
                <Th>Stock Level</Th>
                <Th>Reorder At</Th>
                <Th>Expiration Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const status = getStatus(item.stockLevel, item.reorderThreshold);
                  const displayStatus = status;

                  return (
                    <Tr key={item._id}>
                      <Td>{item.name}</Td>
                      <Td>{item.category}</Td>
                      <Td>{item.supplier}</Td>
                      <Td>{item.stockLevel}</Td>
                      <Td>{item.reorderThreshold}</Td>
                      <Td>{formatDate(item.expirationDate)}</Td>
                      <Td>
                        <Badge colorScheme={statusColors[displayStatus]}>
                          {displayStatus}
                        </Badge>
                      </Td>
                      <Td>
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete inventory"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteClick(item._id)}
                        />
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td colSpan={8} textAlign="center">
                    No inventory items found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Inventory Item
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this inventory item? This action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Flex>
  );
}