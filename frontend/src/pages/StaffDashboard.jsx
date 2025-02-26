import {
  Button,
  Flex,
  IconButton,
  Text,
  VStack,
  HStack,
  Switch,
  Avatar,
  Badge,
  Divider,
  Spacer,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { FaBox, FaShoppingCart, FaLayerGroup } from "react-icons/fa";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const Dashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

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
            Dashboard
          </Button>
          <Button variant="ghost" justifyContent="flex-start" w="full">
            Inventory
          </Button>
        </VStack>
        <Spacer />
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
          <HStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold" color={colorMode === "dark" ? "white" : "black"}>
              Dashboard
            </Text>
          </HStack>
          <HStack spacing={4}>
            <IconButton
              icon={colorMode === "dark" ? < SunIcon/> : <MoonIcon />}
              onClick={toggleColorMode}
              aria-label="Toggle Theme"
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

        {/* Inventory & Orders */}
        <Flex w="full" gap={6}>
          {/* Inventory */}
          <VStack
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            w="full"
            align="start"
            _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
          >
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Inventory
            </Text>
            <Text color="red.500" fontSize="sm">
              This item is low on stock, please order it now!
            </Text>
            <Divider />
            {["Chocolate (Manchee)", "Kottu Mee"].map((item, index) => (
              <Flex key={index} w="full" justify="space-between" align="center">
                <Text color={textColor}>{item}</Text>
                <Button size="sm" colorScheme="blue">
                  Order now
                </Button>
              </Flex>
            ))}
          </VStack>

          {/* Recent Orders */}
          <VStack
            bg={cardBgColor}
            p={6}
            rounded="md"
            boxShadow="md"
            w="full"
            align="start"
            _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
          >
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Recent Orders
            </Text>
            <Divider />
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
              <Flex key={index} w="full" justify="space-between" align="center">
                <Text color={textColor}>{order.name}</Text>
                <Badge colorScheme={order.color}>{order.status}</Badge>
              </Flex>
            ))}
          </VStack>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default Dashboard;