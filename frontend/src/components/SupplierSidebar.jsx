import { 
  Box, 
  Flex, 
  Text, 
  VStack, 
  Button, 
  useColorModeValue, 
  Icon 
} from "@chakra-ui/react"; 
import { FaTachometerAlt, FaBoxes, FaClipboardList, FaStore, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SupplierSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const sidebarBg = useColorModeValue("gray.50", "gray.800");
  const activeBg = useColorModeValue("blue.100", "blue.700");
  const hoverBg = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Items", icon: <FaBoxes /> },
    { name: "Orders", icon: <FaClipboardList /> }
  ];

  return (
    <Flex
      direction="column"
      bg={sidebarBg}
      w="250px"
      h="100vh"
      p={4}
      position="fixed"
      boxShadow="md"
      borderRight="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      {/* Logo / Header */}
      <Flex align="center" mb={8} p={2}>
        <FaStore size="24px" />
        <Text ml={2} fontSize="xl" fontWeight="bold">
          Supplier Portal
        </Text>
      </Flex>

      {/* Menu Items */}
      <VStack align="stretch" spacing={1} flex="1">
        {menuItems.map((item) => (
          <Button
            key={item.name}
            leftIcon={item.icon}
            justifyContent="flex-start"
            variant="ghost"
            bg={activeTab === item.name ? activeBg : "transparent"}
            _hover={{ bg: hoverBg }}
            onClick={() => setActiveTab(item.name)}
          >
            {item.name}
          </Button>
        ))}
      </VStack>

      {/* Logout Button pinned at bottom */}
      <Flex
        align="center"
        p={3}
        borderRadius="md"
        _hover={{ bg: hoverBg }}
        color={textColor}
        cursor="pointer"
        onClick={handleLogout}
      >
        <Icon as={FaSignOutAlt} mr={2} />
        <Text>Logout</Text>
      </Flex>
    </Flex>
  );
};

export default SupplierSidebar;
