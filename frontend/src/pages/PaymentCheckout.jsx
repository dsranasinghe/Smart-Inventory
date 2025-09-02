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
  RadioGroup,
  Radio,
  Stack,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Sidebar from "../components/sidebar";
import { useState } from "react";

const CheckoutPage = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryColor = useColorModeValue("gray.500", "gray.300");
  const toast = useToast();
  
  // State management
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("payhere");
  const [isLoading, setIsLoading] = useState(false);

  // Order items data
  const orderItems = [
    { name: "Tunnel Leather Rtg", price: 59.29, duration: "01-0 <Short> 4:00" },
    { name: "Brew Vega Lounge", price: 49.90, duration: "01-0 <Short> 4:00" },
  ];

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal * quantity;

  // Handle payment submission
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      if (paymentMethod === "payhere") {
        // Implement PayHere payment integration
        await handlePayHerePayment();
      } else if (paymentMethod === "cod") {
        // Handle COD order
        await handleCODOrder();
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // PayHere payment handler
  const handlePayHerePayment = async () => {
    // Implement your PayHere integration here
    // This would typically redirect to PayHere or open a modal
    toast({
      title: "Redirecting to PayHere",
      description: "You will be redirected to complete your payment.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }, 2000);
  };

  // COD order handler
  const handleCODOrder = async () => {
    // Implement COD order processing
    toast({
      title: "COD Order Placed",
      description: "Your Cash on Delivery order has been placed successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

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
              {orderItems.map((item, index) => (
                <Flex justify="space-between" key={index}>
                  <Text>{item.name}</Text>
                  <Text fontSize="sm" color={secondaryColor}>{item.duration}</Text>
                </Flex>
              ))}
            </VStack>
          </Box>

          <Divider my={4} />

          {/* Pricing */}
          <Box mb={6}>
            {orderItems.map((item, index) => (
              <Flex justify="space-between" align="center" mb={2} key={index}>
                <Text fontWeight="medium" color={textColor}>Rs{item.price.toFixed(2)}</Text>
                <Text fontWeight="medium" color={textColor}>Qty ${index + 1}</Text>
              </Flex>
            ))}
            <Flex justify="space-between" align="center" mt={4}>
              <Text fontWeight="bold" color={textColor}>Quantity</Text>
              <Input 
                size="sm" 
                w="80px" 
                type="number" 
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                bg={useColorModeValue("gray.100", "gray.600")} 
              />
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
                Rs{total.toFixed(2)}
              </Text>
            </HStack>
          </Flex>

          {/* Payment Method Selection */}
          <Box mb={6}>
            <Text fontSize="lg" fontWeight="semibold" mb={3} color={textColor}>
              Payment Method
            </Text>
            
            <RadioGroup 
              onChange={setPaymentMethod} 
              value={paymentMethod}
              colorScheme="purple"
            >
              <Stack direction="column" spacing={3}>
                <Radio value="payhere">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">PayHere</Text>
                    <Text fontSize="sm" color={secondaryColor}>
                      Pay securely with credit/debit card or digital wallet
                    </Text>
                  </VStack>
                </Radio>
                
                <Radio value="cod">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">Cash on Delivery (COD)</Text>
                    <Text fontSize="sm" color={secondaryColor}>
                      Pay in cash when your order is delivered
                    </Text>
                  </VStack>
                </Radio>
              </Stack>
            </RadioGroup>
            
            {/* Payment method-specific information */}
            {paymentMethod === "cod" && (
              <Alert status="info" mt={3} borderRadius="md" fontSize="sm">
                <AlertIcon />
                A 2% processing fee will be added to COD orders.
              </Alert>
            )}
          </Box>

          <Divider my={4} />

          {/* Actions */}
          <HStack spacing={4}>
            <Button 
              colorScheme="purple" 
              flex={1}
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText={paymentMethod === "payhere" ? "Processing..." : "Placing Order"}
            >
              {paymentMethod === "payhere" ? "Pay Now" : "Place COD Order"}
            </Button>
            <Button variant="outline" colorScheme="gray" flex={1}>
              Shaping
            </Button>
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default CheckoutPage;