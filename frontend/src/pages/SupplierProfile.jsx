import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Divider,
  useColorModeValue,
  Avatar,
  IconButton,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorMode,
  Spacer, 
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

// Mock Data for Supplier Orders
const supplierOrders = [
  {
    date: "2025/01/19",
    orders: [
      { name: "Product A", price: "$40.00" },
      { name: "Product B", price: "$40.00" },
    ],
    subtotal: "$80.00",
    discount: "$0.00",
    shipping: "$2.00",
    total: "$82.00",
    status: "Delivered",
  },
  {
    date: "2025/02/10",
    orders: [
      { name: "Product C", price: "$25.00" },
      { name: "Product D", price: "$30.00" },
    ],
    subtotal: "$55.00",
    discount: "$5.00",
    shipping: "$3.00",
    total: "$53.00",
    status: "Pending",
  },
];

// Mock Data for Upcoming Orders
const upcomingOrders = [
  {
    date: "2025/03/15",
    products: [
      { name: "Product E", quantity: 10 },
      { name: "Product F", quantity: 5 },
    ],
    expectedDelivery: "2025/03/20",
  },
  {
    date: "2025/03/20",
    products: [
      { name: "Product G", quantity: 8 },
      { name: "Product H", quantity: 12 },
    ],
    expectedDelivery: "2025/03/25",
  },
];

// Mock Data for Notifications
const notifications = [
  { message: "New order received for 2025/03/15", date: "2025/03/10" },
  { message: "Payment received for order 2025/01/19", date: "2025/01/25" },
];

const SupplierDashboard = () => {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex bg={bgColor} minH="100vh" p={4}>
      {/* Sidebar */}
      <VStack
        bg={cardBgColor}
        w={{ base: "full", md: "250px" }}
        p={4}
        spacing={6}
        boxShadow="md"
        borderRadius="md"
      >
        <IconButton
          icon={<FiMenu />}
          aria-label="Menu"
          size="lg"
          variant="ghost"
        />
        <VStack align="start" w="full">
          <Button variant="ghost" justifyContent="flex-start" w="full">
            Orders
          </Button>
          <Button variant="ghost" justifyContent="flex-start" w="full">
            Profile
          </Button>
        </VStack>
        <Spacer /> {/* Spacer to push content to the bottom */}
        <VStack align="start" w="full">
          <Button variant="ghost" justifyContent="flex-start" w="full">
            Settings
          </Button>
          <Button variant="ghost" justifyContent="flex-start" w="full">
            Log out
          </Button>
        </VStack>
      </VStack>

      {/* Main Content */}
      <VStack flex={1} p={6} spacing={6}>
        {/* Top Bar */}
        <Flex w="full" justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Supplier Dashboard
          </Text>
          <HStack spacing={4}>
            <IconButton
              icon={<FaBell />}
              aria-label="Notifications"
              variant="ghost"
              color={textColor}
            />
            <IconButton
              icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
              onClick={toggleColorMode}
              aria-label="Toggle Theme"
              variant="ghost"
              color={textColor}
            />
            <Avatar name="Ann Lee" />
          </HStack>
        </Flex>

        {/* Notifications */}
        <Box
          bg={cardBgColor}
          p={6}
          rounded="md"
          boxShadow="md"
          w="full"
        >
          <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
            Notifications
          </Text>
          {notifications.map((notification, index) => (
            <Box key={index} mb={4}>
              <Text color={textColor}>{notification.message}</Text>
              <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
                {notification.date}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Upcoming Orders */}
        <Box
          bg={cardBgColor}
          p={6}
          rounded="md"
          boxShadow="md"
          w="full"
        >
          <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
            Upcoming Orders
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Order Date</Th>
                <Th>Products</Th>
                <Th>Expected Delivery</Th>
              </Tr>
            </Thead>
            <Tbody>
              {upcomingOrders.map((order, index) => (
                <Tr key={index}>
                  <Td>{order.date}</Td>
                  <Td>
                    {order.products.map((product, idx) => (
                      <Text key={idx}>
                        {product.name} (x{product.quantity})
                      </Text>
                    ))}
                  </Td>
                  <Td>{order.expectedDelivery}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Past Orders */}
        {supplierOrders.map((order, index) => (
          <Box
            key={index}
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            w="full"
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Order Date: {order.date}
              </Text>
              <Badge colorScheme={order.status === "Delivered" ? "green" : "orange"}>
                {order.status}
              </Badge>
            </Flex>
            {order.orders.map((item, idx) => (
              <HStack key={idx} justify="space-between" w="full" mb={2}>
                <Text color={textColor}>{item.name}</Text>
                <Text color={textColor}>{item.price}</Text>
              </HStack>
            ))}
            <Divider my={4} />
            <HStack justify="space-between">
              <Text color={textColor}>Subtotal</Text>
              <Text>{order.subtotal}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color={textColor}>Discount</Text>
              <Text>{order.discount}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color={textColor}>Shipping</Text>
              <Text>{order.shipping}</Text>
            </HStack>
            <Divider my={4} />
            <HStack justify="space-between" fontWeight="bold">
              <Text color={textColor}>Total</Text>
              <Text>{order.total}</Text>
            </HStack>
            <Button mt={4} colorScheme="blackAlpha" w="full">
              View Details
            </Button>
          </Box>
        ))}
      </VStack>
    </Flex>
  );
};

export default SupplierDashboard;