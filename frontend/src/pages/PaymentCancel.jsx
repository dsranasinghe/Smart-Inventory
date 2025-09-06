import { Box, Text, Button, VStack} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <WarningIcon boxSize={"50px"} color={"orange.500"} />
      <Text fontSize="xl" mt={3} mb={2}>
        Payment Cancelled
      </Text>
      <Text color={"gray.500"} mb={6}>
        Your payment was cancelled. No amount was deducted.
      </Text>
      <Button colorScheme="purple" as={Link} to="/payments">
        Back to Payments
      </Button>
    </Box>
  );
};

export default PaymentCancel;