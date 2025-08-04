import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Button,
  useColorModeValue,
  Spacer,
  Tag,
  Input,
} from "@chakra-ui/react";
import Sidebar from "../components/sidebar";

const checkoutPage = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryColor = useColorModeValue("gray.500", "gray.300");

  return (
    <Flex>
      <Sidebar />

      <Box p={8} flex={1}>
        {/* Header */}
        <VStack align="start" spacing={1} mb={6}>
          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            Payment
          </Text>
          <HStack>
            <Text fontSize="md" color={secondaryColor}>
              Pay Note
            </Text>
            <Tag size="md" colorScheme="purple">@Trunker</Tag>
          </HStack>
        </VStack>

        {/* Card */}
        <Box bg={cardBg} p={6} rounded="md" boxShadow="lg">
          {/* User Details */}
          <HStack spacing={8} mb={4}>
            <Text fontWeight="medium" color={textColor}>
              Trunker ID: <span style={{ fontWeight: "bold" }}>0381012</span>
            </Text>
            <Text fontWeight="medium" color={textColor}>
              Phone/EMR: <span style={{ fontWeight: "bold" }}>EMR: 0123456781*</span>
            </Text>
          </HStack>

          {/* Term Info */}
          <Text color={secondaryColor} mb={4}>
            For term in <strong>100.00 minutes</strong>
          </Text>

          {/* Payment Note */}
          <Text fontSize="sm" color={textColor} mb={6}>
            You propose each action, and it is considered by an expert associated with this business. 
            Your proposed activities are treated as a priority policy.
          </Text>

          {/* Order Summary */}
          <Box mb={6}>
            <Text fontSize="lg" fontWeight="semibold" mb={2} color={textColor}>
              Order Summary
            </Text>
            <VStack spacing={3} align="stretch">
              <Flex justify="space-between">
                <Text>Tunnel Leather Rtg</Text>
                <Text fontSize="sm" color={secondaryColor}>01-0 &lt;Short&gt; 4:00</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>Brew Vega Lounge</Text>
                <Text fontSize="sm" color={secondaryColor}>01-0 &lt;Short&gt; 4:00</Text>
              </Flex>
            </VStack>
          </Box>

          <Divider my={4} />

          {/* Pricing */}
          <Box mb={6}>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="medium" color={textColor}>Rs59.29</Text>
              <Text fontWeight="medium" color={textColor}>Qty $</Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontWeight="medium" color={textColor}>Rs49.90</Text>
              <Input size="sm" w="80px" placeholder="Qty" bg={useColorModeValue("gray.100", "gray.600")} />
            </Flex>
          </Box>

          <Divider my={4} />

          {/* Total */}
          <Flex justify="space-between" align="center" mb={6}>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>Total</Text>
            <HStack>
              <Text fontSize="md" fontWeight="medium" color="green.400">
                Holding 23% Value
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="purple.500">
                Rs109.19
              </Text>
            </HStack>
          </Flex>

          {/* Actions */}
          <HStack spacing={4}>
            <Button colorScheme="purple" flex={1}>Submit</Button>
            <Button variant="outline" colorScheme="gray" flex={1}>Shaping</Button>
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default checkoutPage;
