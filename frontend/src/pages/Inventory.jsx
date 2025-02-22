import React from "react";
import Sidebar from "../components/sidebar";
import InventoryForm from "../components/addInventory";
import { HStack } from "@chakra-ui/react";

const InventoryPage = () => {
  return (
  <HStack>
    <Sidebar />
<InventoryForm />
  </HStack>
      
    
  );
};

export default InventoryPage;
