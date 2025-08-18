import { Center, Text, Button, Icon } from "@chakra-ui/react";
import { FaBoxOpen } from "react-icons/fa";

const EmptyState = ({ onAddItem }) => {
  return (
    <Center
      bg="gray.50"
      p={12}
      borderRadius="xl"
      flexDirection="column"
      textAlign="center"
      border="2px dashed"
      borderColor="gray.300"
      minH="300px"
      width="100%"
    >
      <Icon 
        as={FaBoxOpen} 
        boxSize={10} 
        mb={4} 
        color="gray.400"
      />
      <Text fontSize="xl" fontWeight="medium" color="gray.500" mb={2}>
        No items supplied yet
      </Text>
      <Text color="gray.500" mb={4} maxWidth="400px">
        Get started by adding your first product to inventory
      </Text>
      <Button
        colorScheme="blue"
        leftIcon={<FaPlus />}
        onClick={onAddItem}
        size="md"
        mt={2}
      >
        Add First Item
      </Button>
    </Center>
  );
};

export default EmptyState;