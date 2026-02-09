import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const InventoryHeader = ({ selectedCategory, onCategoryChange }) => {
  const navigate = useNavigate();

  // Changed "Diary" to "Dairy" to match likely database values
  const categories = ["All", "Dairy", "Beverages", "Snacks", "Vegetables", "Meat"];

  return (
    <Flex justify="space-between" mb={4}>
      <Flex gap={2} flexWrap="wrap">
        {categories.map((category) => (
          <Button
            key={category}
            colorScheme="purple"
            variant={selectedCategory === category ? "solid" : "outline"}
            onClick={() => onCategoryChange(category)}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </Flex>
      <Button colorScheme="purple" onClick={() => navigate("/inventoryadd")}>
        + New Inventory
      </Button>
    </Flex>
  );
};

export default InventoryHeader;