import React from "react";
import { VStack, Text, Icon, Link, Box, useColorModeValue } from "@chakra-ui/react";
import {
  FaBox,
  FaShoppingCart,
  FaWarehouse,
  FaUsers,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaWallet,
  FaHome,
} from "react-icons/fa";

const Sidebar = () => {
  // Define colors for light/dark mode
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverBgColor = useColorModeValue("gray.200", "gray.700");
  const activeBgColor = useColorModeValue("purple.500", "purple.200");
  const activeTextColor = useColorModeValue("white", "gray.800");

  return (
    <VStack
      bg={bgColor}
      h="100vh"
      w="250px"
      p={5}
      align="stretch"
      boxShadow="lg"
      spacing={4}
    >
      {/* Logo or Title */}
      <Text fontSize="2xl" fontWeight="bold" color="purple.500" mb={6}>
        Inventory System
      </Text>

      {/* Sidebar Links */}

      <Link
        p={3}
        borderRadius="md"
        _hover={{ bg: hoverBgColor }}
        _activeLink={{ bg: activeBgColor, color: activeTextColor }}
        color={textColor}
      >
        <Icon as={FaHome} mr={2} />
        Dashboard
      </Link>

      <Link
        p={3}
        borderRadius="md"
        _hover={{ bg: hoverBgColor }}
        _activeLink={{ bg: activeBgColor, color: activeTextColor }}
        color={textColor}
      >
        <Icon as={FaBox} mr={2} />
        Inventory
      </Link>

      <Link
        p={3}
        borderRadius="md"
        _hover={{ bg: hoverBgColor }}
        _activeLink={{ bg: activeBgColor, color: activeTextColor }}
        color={textColor}
      >
        <Icon as={FaShoppingCart} mr={2} />
        Orders
      </Link>

      

      <Link
        p={3}
        borderRadius="md"
        _hover={{ bg: hoverBgColor }}
        _activeLink={{ bg: activeBgColor, color: activeTextColor }}
        color={textColor}
      >
        <Icon as={FaWarehouse} mr={2} />
        InStock
      </Link>

      <Link
        p={3}
        borderRadius="md"
        _hover={{ bg: hoverBgColor }}
        _activeLink={{ bg: activeBgColor, color: activeTextColor }}
        color={textColor}
      >
        <Icon as={FaUsers} mr={2} />
        Suppliers
      </Link>

      <Link
        p={3}
        borderRadius="md"
        _hover={{ bg: hoverBgColor }}
        _activeLink={{ bg: activeBgColor, color: activeTextColor }}
        color={textColor}
      >
        <Icon as={FaChartBar} mr={2} />
        Report
      </Link>
      
      <Link
        p={3}
        borderRadius="md"
        _hover={{ bg: hoverBgColor }}
        _activeLink={{ bg: activeBgColor, color: activeTextColor }}
        color={textColor}
      >
        <Icon as={FaWallet} mr={2} />
        Payment
      </Link>

      <Link
        p={3}
        borderRadius="md"
        _hover={{ bg: hoverBgColor }}
        _activeLink={{ bg: activeBgColor, color: activeTextColor }}
        color={textColor}
      >
        <Icon as={FaCog} mr={2} />
        Settings
      </Link>

      {/* Logout Link */}
      <Box mt="auto">
        <Link
          p={3}
          borderRadius="md"
          _hover={{ bg: hoverBgColor }}
          color={textColor}
        >
          <Icon as={FaSignOutAlt} mr={2} />
          Logout
        </Link>
      </Box>
    </VStack>
  );
};

export default Sidebar;