import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Divider,
  useColorMode,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import { FaBox, FaShoppingCart, FaLayerGroup, FaSun, FaMoon, FaTrashAlt, FaEdit, FaArrowUp } from "react-icons/fa";
import {
  BarChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";
import Sidebar from "../components/sidebar";

// Mock data for charts
const inventoryData = [
  { name: "Chocolate", stock: 30000, outOfStock: 30 },
  { name: "Kottu Mee", stock: 25000, outOfStock: 20 },
  { name: "Samaposha", stock: 20000, outOfStock: 10 },
];

const orderData = [
  { name: "Jan", orders: 100 },
  { name: "Feb", orders: 200 },
  { name: "Mar", orders: 150 },
  { name: "Apr", orders: 300 },
  { name: "May", orders: 250 },
];

const Dashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Flex bg={bgColor} minH="100vh" p={4}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <VStack flex={1} p={6} spacing={6}>
        {/* Top Bar */}
        <Flex w="full" justify="space-between" align="center">
          <HStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold" color={colorMode === "dark" ? "white" : "black"}>
              Dashboard
            </Text>
          </HStack>
          <HStack spacing={4}>
            <IconButton
              icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
              onClick={toggleColorMode}
              aria-label="Toggle Theme"
              variant="ghost"
              color={textColor}
              _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
            />
            <Avatar name="Ann Lee" />
          </HStack>
        </Flex>

        {/* Stats */}
        <Flex w="full" justify="space-between" gap={6}>
          {[
            {
              icon: FaBox,
              label: "Total Products",
              value: "+30,000",
              color: "green.500",
            },
            {
              icon: FaShoppingCart,
              label: "Out of stock",
              value: "-30",
              color: "red.500",
            },
            {
              icon: FaLayerGroup,
              label: "All Categories",
              value: "+30,000",
              color: "green.500",
            },
          ].map((stat, index) => (
            <VStack
              key={index}
              bg={cardBgColor}
              p={6}
              rounded="md"
              boxShadow="md"
              w="full"
              _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
            >
              <stat.icon size={30} color={stat.color} />
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                {stat.label}
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color={stat.color}>
                {stat.value}
              </Text>
            </VStack>
          ))}
        </Flex>
        
        {/* Charts */}
        <Flex w="full" gap={6}>
          {/* Bar Chart - Inventory */}
          <Box
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            w="full"
            _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
          >
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Inventory Overview
            </Text>
            <BarChart
              width={500}
              height={300}
              data={inventoryData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#8884d8" />
              <Bar dataKey="outOfStock" fill="#82ca9d" />
            </BarChart>
          </Box>

          {/* Line Chart - Orders */}
          <Box
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            w="full"
            _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
          >
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Recent Orders
            </Text>
            <LineChart
              width={500}
              height={300}
              data={orderData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" />
            </LineChart>
          </Box>
        </Flex>

        {/* Inventory & Orders */}
        <Flex w="full" gap={6}>
          {/* Inventory */}
          <Box
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            w="full"
            _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
          >
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Inventory
            </Text>
            <Text color="red.500" fontSize="sm">
              This item is low on stock, please order it now!
            </Text>
            <Divider my={4} />
            {["Chocolate (Manchee)", "Kottu Mee"].map((item, index) => (
              <Flex key={index} w="full" justify="space-between" align="center" my={2}>
                <Text color={textColor}>{item}</Text>
                <Button size="sm" colorScheme="blue">
                  Order now
                </Button>
              </Flex>
            ))}
          </Box>

          {/* Recent Orders */}
          <Box
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            w="full"
            _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
          >
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Recent Orders
            </Text>
            <Divider my={4} />
            {[
              {
                name: "Samaposha 700g",
                status: "Pending",
                color: "orange",
              },
              {
                name: "SunSilk Shampoo 100ml",
                status: "Done",
                color: "green",
              },
              {
                name: "Chocolate Box",
                status: "Pending",
                color: "orange",
              },
            ].map((order, index) => (
              <Flex key={index} w="full" justify="space-between" align="center" my={2}>
                <Text color={textColor}>{order.name}</Text>
                <Badge colorScheme={order.color}>{order.status}</Badge>
              </Flex>
            ))}
          </Box>
        </Flex>

        {/* Billing Information and Transaction History */}
        <Flex w="full" gap={6}>
          {/* Billing Information Card */}
          <Box
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            w="50%"
            _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
          >
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Billing Information
            </Text>
            {Array(2).fill(0).map((_, i) => (
              <Box key={i} bg={useColorModeValue("gray.50", "gray.600")} p={4} rounded="md" mb={4}>
                <Text fontWeight="bold">Oliver</Text>
                <Text>Liam Wang Burrito</Text>
                <Text>Email: oliver@burrito.com</Text>
                <Text>GST Number: FRB1235476</Text>
                <HStack spacing={4} mt={2}>
                  <IconButton
                    icon={<FaTrashAlt />}
                    aria-label="Delete"
                    colorScheme="red"
                    variant="ghost"
                  />
                  <IconButton
                    icon={<FaEdit />}
                    aria-label="Edit"
                    colorScheme="blue"
                    variant="ghost"
                  />
                </HStack>
              </Box>
            ))}
          </Box>

          {/* Transaction History Card */}
          <Box
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            w="50%"
            _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Transaction History
              </Text>
              <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
                23 - 30 March 2025
              </Text>
            </Flex>
            <Table variant="simple">
              <Tbody>
                {[
                  { supplier: "Supplier Name", date: "27 March 2025, 12:30 PM", amount: "$500", color: "green" },
                  { supplier: "Supplier Name", date: "27 March 2025, 12:30 PM", amount: "$2500", color: "green" },
                  { supplier: "Supplier Name", date: "26 March 2025, 13:45 PM", amount: "$800", color: "green" },
                  { supplier: "Supplier Name", date: "26 March 2025, 12:30 PM", amount: "$1700", color: "green" },
                  { supplier: "Shop Name", date: "26 March 2025, 05:00 AM", amount: "$1300", color: "green" },
                  { supplier: "Shop Name", date: "25 March 2025, 16:30 PM", amount: "$987", color: "green" },
                ].map((transaction, index) => (
                  <Tr key={index}>
                    <Td>
                      <HStack spacing={2}>
                        <FaArrowUp color={transaction.color} />
                        <Text>{transaction.supplier}</Text>
                      </HStack>
                      <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
                        {transaction.date}
                      </Text>
                    </Td>
                    <Td isNumeric color={transaction.color}>{transaction.amount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default Dashboard;