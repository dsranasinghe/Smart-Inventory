import { Box, Flex, Text, VStack, Button, useColorModeValue } from "@chakra-ui/react";
import { 
  FaTachometerAlt, 
  FaBoxes, 
  FaClipboardList,
  FaStore
} from "react-icons/fa";

const SupplierSidebar = ({ activeTab, setActiveTab }) => {
  const sidebarBg = useColorModeValue("gray.50", "gray.800");
  const activeBg = useColorModeValue("blue.100", "blue.700");
  const hoverBg = useColorModeValue("gray.200", "gray.700");

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Items", icon: <FaBoxes /> },
    { name: "Orders", icon: <FaClipboardList /> }
  ];

  return (
    <Box 
      bg={sidebarBg} 
      w="250px" 
      h="100vh" 
      p={4} 
      position="fixed" 
      boxShadow="md"
    >
      <Flex align="center" mb={8} p={2}>
        <FaStore size="24px" />
        <Text ml={2} fontSize="xl" fontWeight="bold">Supplier Portal</Text>
      </Flex>
      
      <VStack align="stretch" spacing={1}>
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
    </Box>
  );
};

export default SupplierSidebar;