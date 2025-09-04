import { Box, Text, Button, VStack,  } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
      <Text fontSize="xl" mt={3} mb={2}>
        Payment Successful!
      </Text>
      <Text color={"gray.500"} mb={6}>
        Thank you for your payment. The supplier has been notified.
      </Text>
      <Button colorScheme="purple" as={Link} to="/orders">
        Back to Orders
      </Button>
    </Box>
  );
};

export default PaymentSuccess;