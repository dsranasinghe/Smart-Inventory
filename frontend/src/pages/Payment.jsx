import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  useColorModeValue,
  HStack,
  Divider,
  Badge,
} from "@chakra-ui/react";
import Sidebar from "../components/sidebar";

const PaymentPage = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  const suppliers = [
    {
      id: "SUP-001",
      name: "Liam Wang",
      email: "liam@burrito.com",
      totalDue: 235000.0,
      dueDate: "2025-07-10",
    },
    {
      id: "SUP-002",
      name: "Nimal Perera",
      email: "nimal@store.lk",
      totalDue: 480500.5,
      dueDate: "2025-07-12",
    },
    {
      id: "SUP-003",
      name: "Anya Lee",
      email: "anya@products.com",
      totalDue: 315750.75,
      dueDate: "2025-07-15",
    },
  ];

  const handlePayment = (supplierId) => {
    alert(`Payment triggered for supplier: ${supplierId}`);
    navigate("/payment/checkout");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Flex>
      <Sidebar />
      <Box p={6} flex={1}>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Supplier Payments
        </Text>

        <VStack spacing={6} align="stretch">
          {suppliers.map((supplier) => (
            <Box
              key={supplier.id}
              bg={cardBg}
              p={6}
              rounded="md"
              boxShadow="md"
              _hover={{ transform: "scale(1.01)", transition: "0.2s ease" }}
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Box>
                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    {supplier.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {supplier.email}
                  </Text>
                </Box>
                <Badge colorScheme="orange">Due: {supplier.dueDate}</Badge>
              </Flex>

              <Divider mb={4} />

              <HStack justify="space-between">
                <Text fontSize="xl" fontWeight="bold" color="purple.500">
                  {formatCurrency(supplier.totalDue)}
                </Text>
                <Button
                  colorScheme="purple"
                  onClick={() => handlePayment(supplier.id)}
                >
                  Proceed to Payment
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
};

export default PaymentPage;
