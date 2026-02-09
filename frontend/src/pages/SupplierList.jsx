import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  IconButton,
  Avatar,
  useColorMode,
  useColorModeValue,
  Grid,
  Spinner,
} from "@chakra-ui/react";
import { FaSun, FaMoon, FaStore } from "react-icons/fa";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SupplierList = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/suppliers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex bg={bgColor} minH="100vh" p={4}>
      <Sidebar />

      <VStack flex={1} p={6} spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            Supplier List
          </Text>
          <HStack spacing={4}>
            <IconButton
              icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
              onClick={toggleColorMode}
              aria-label="Toggle Theme"
              variant="ghost"
              color={textColor}
              _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
            />
            <Avatar name="Admin" />
          </HStack>
        </Flex>

        {/* Supplier Cards */}
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {suppliers.map((supplier) => (
            <Box
              as={Link}
              to={`/suppliers/${supplier._id}`}     
              bg={cardBgColor}
              p={6}
              rounded="md"
              boxShadow="md"
              _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
            >
              <HStack spacing={4}>
                <Avatar icon={<FaStore />} name={supplier.username} />
                <VStack align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    {supplier.username}
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
                    {supplier.email}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Joined: {new Date(supplier.createdAt).toLocaleDateString()}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </Grid>
      </VStack>
    </Flex>
  );
};

export default SupplierList;