import React from "react";
import {
  VStack,
  Text,
  Icon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
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
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ userRole = "manager" }) => {  // Default to manager if not specified
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverBgColor = useColorModeValue("gray.200", "gray.700");
  const activeBgColor = useColorModeValue("purple.500", "purple.200");
  const activeTextColor = useColorModeValue("white", "gray.800");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Common items for both roles
  const commonItems = [
    { label: "Dashboard", icon: FaHome, to: userRole === "manager" ? "/manager" : "/staff" },
    { label: "Inventory", icon: FaBox, to: userRole === "manager" ? "/inventory" : "" },
  ];

  // Manager-specific items
  const managerItems = [
    { label: "Orders", icon: FaShoppingCart, to: "/orders" },
    { label: "Suppliers", icon: FaUsers, to: "/suppliers" },
    { label: "Report", icon: FaChartBar, to: "/report" },
    { label: "Payment", icon: FaWallet, to: "/payment" },
    { label: "Settings", icon: FaCog, to: "/settings" },
  ];

  // Combine items based on user role
  const navItems = userRole === "manager" 
    ? [...commonItems, ...managerItems] 
    : commonItems;

  return (
    <VStack
      bg={bgColor}
      h="100vh"
      w="250px"
      p={5}
      align="stretch"
      boxShadow="lg"
      spacing={2}
    >
      <Text fontSize="2xl" fontWeight="bold" color="purple.500" mb={6}>
        Inventory System
      </Text>

      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.to}
          style={{ textDecoration: "none" }}
          end
          className={({ isActive }) =>
            isActive ? "active-link" : ""
          }
        >
          <Flex
            align="center"
            p={3}
            borderRadius="md"
            _hover={{ bg: hoverBgColor }}
            color={textColor}
            transition="0.2s"
            _activeLink={{ bg: activeBgColor, color: activeTextColor }}
            as="div"
          >
            <Icon as={item.icon} mr={2} />
            <Text>{item.label}</Text>
          </Flex>
        </NavLink>
      ))}

      <Flex mt="auto">
        <Flex
          align="center"
          p={3}
          borderRadius="md"
          _hover={{ bg: hoverBgColor }}
          color={textColor}
          cursor="pointer"
          w="full"
          onClick={handleLogout}
        >
          <Icon as={FaSignOutAlt} mr={2} />
          <Text>Logout</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default Sidebar;