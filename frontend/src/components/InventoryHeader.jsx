import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const InventoryHeader = () => {
  const navigate = useNavigate();

  return (
    <Flex justify="space-between" mb={4}>
      <Flex gap={2}>
        <Button colorScheme="purple">Category 1</Button>
        <Button colorScheme="purple" variant="outline">Category 2</Button>
        <Button colorScheme="purple" variant="outline">Category 3</Button>
      </Flex>
      <Button colorScheme="purple" onClick={() => navigate("/inventoryadd")}>
        + New Inventory
      </Button>
    </Flex>
  );
};

export default InventoryHeader;
