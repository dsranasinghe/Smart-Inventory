import { Box, VStack, HStack, Text, Badge, Button } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ItemCard = ({ item, onEdit, onDelete, cardBg, textColor, borderColor, hoverBorderColor }) => {
  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="xl"
  width="350px" // Fixed width
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{ 
        transform: "translateY(-5px)",
        boxShadow: "xl",
        borderColor: hoverBorderColor
      }}
      height="100%"
          >
      <VStack align="start" spacing={4} height="100%">
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          {item.name}
        </Text>
        
        {item.description && (
          <Text color="gray.600" fontSize="sm">
            {item.description}
          </Text>
        )}
        
        <HStack spacing={4} mt={2}>
          <Text fontWeight="semibold">${item.unitPrice}</Text>
          <Text fontSize="sm" color="gray.500">
            {item.deliveryType} delivery
          </Text>
        </HStack>
        
        <Badge
          colorScheme={item.inStock ? "green" : "red"}
          fontSize="sm"
          px={3}
          py={1}
          borderRadius="full"
          alignSelf="flex-start"
          mt={2}
        >
          {item.inStock ? "In Stock" : "Out of Stock"}
        </Badge>
        
        <HStack spacing={3} pt={4} mt="auto">
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            leftIcon={<FaEdit />}
            onClick={() => onEdit(item)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            leftIcon={<FaTrash />}
            onClick={() => onDelete(item._id)}
          >
            Delete
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ItemCard;