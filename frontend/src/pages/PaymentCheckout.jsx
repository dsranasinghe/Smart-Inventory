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
  Spinner,
} from "@chakra-ui/react";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryColor = useColorModeValue("gray.500", "gray.300");
  
  // State management
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("payhere");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Fix the order data fetching in useEffect
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        
        const orderRes = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!orderRes.data) {
          throw new Error("No order data returned from API");
        }
        
        setOrder(orderRes.data);
        
        // Check if supplier data exists before fetching
        if (orderRes.data.supplier) {
          const supplierRes = await axios.get(
            `http://localhost:5000/api/suppliers/${orderRes.data.supplier}`, 
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setSupplier(supplierRes.data);
        } else {
          console.warn("No supplier ID found in order data");
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load order details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoadingData(false);
      }
    };
    
    if (orderId) {
      fetchOrderData();
    } else {
      toast({
        title: "Error",
        description: "No order ID provided",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoadingData(false);
    }
  }, [orderId, toast]);

  // Calculate totals based on actual order data
  const subtotal = order ? order.orderTotal : 0;
  const total = subtotal * quantity;

  // Handle payment submission
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      if (paymentMethod === "payhere") {
        await handlePayHerePayment();
      } else if (paymentMethod === "cod") {
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
      setIsLoading(false);
    }
  };

  // REAL PayHere payment handler
  const handlePayHerePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      // FIXED: Changed from "user" to "users" to match your collection name
      const userData = localStorage.getItem("users");
      const user = userData ? JSON.parse(userData) : null;
      
      if (!order) {
        throw new Error("Order data not available");
      }

      // Check if payhere is loaded
      if (typeof window.payhere === 'undefined') {
        throw new Error('PayHere payment gateway not loaded. Please refresh the page.');
      }

      // 1. Get payment hash from backend
      const response = await axios.post(
        'http://localhost:5000/api/payments/generate-hash',
        {
          order_id: order.orderNumber,
          amount: total
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if hash was generated successfully
      if (!response.data.hash) {
        throw new Error("Failed to generate payment hash");
      }

      const { hash, merchantId, amount, currency } = response.data;

      // FIXED: Updated to match your actual supplier data structure
      // If your suppliers collection has different field names, update these:
      const supplierPhone = supplier?.phone || supplier?.phoneNumber || '0771234567';
      const supplierAddress = supplier?.address || supplier?.location || 'Colombo';
      const supplierId = supplier?._id || order.supplier;

      // 2. Create payment object
      const payment = {
        sandbox: true, // true for testing, false in production
        merchant_id: merchantId,
        return_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/payment-cancel`,
        notify_url: 'http://localhost:5000/api/payments/notify',
        order_id: order.orderNumber,
        items: `Payment for Order ${order.orderNumber}`,
        amount: amount,
        currency: currency,
        hash: hash,
        first_name: user?.first_name || user?.username || 'Customer',
        last_name: user?.last_name || '',
        email: user?.email || 'customer@example.com',
        phone: supplierPhone,
        address: supplierAddress,
        city: 'Colombo',
        country: 'Sri Lanka',
        custom_1: user?._id || 'manager_id',
        custom_2: supplierId
      };

      // 3. Set up payment handlers
      window.payhere.onCompleted = function(onCompletedOrderId) {
        console.log("Payment completed. OrderID:", onCompletedOrderId);
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/payment-success');
      };

      window.payhere.onDismissed = function() {
        console.log("Payment dismissed");
        setIsLoading(false);
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment process.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      };

      window.payhere.onError = function(error) {
        console.log("Error:", error);
        setIsLoading(false);
        toast({
          title: "Payment Error",
          description: "An error occurred during payment processing.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      };

      // 4. Start payment
      window.payhere.startPayment(payment);

    } catch (error) {
      console.error('Payment initiation failed:', error);
      setIsLoading(false);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initialize payment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // COD order handler
  const handleCODOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/orders/${orderId}/cod`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast({
        title: "COD Order Placed",
        description: "Your Cash on Delivery order has been placed successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/orders');
    } catch (error) {
      console.error('COD order failed:', error);
      toast({
        title: "Order Failed",
        description: "Failed to place COD order. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Flex>
        <Sidebar />
        <Box p={8} flex={1} display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={4}>
            <Spinner size="xl" thickness="4px" speed="0.65s" color="purple.500" />
            <Text color={textColor}>Loading order details...</Text>
          </VStack>
        </Box>
      </Flex>
    );
  }

  if (!order) {
    return (
      <Flex>
        <Sidebar />
        <Box p={8} flex={1}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">Order not found</Text>
              <Text fontSize="sm">The requested order could not be loaded.</Text>
            </VStack>
          </Alert>
          <Button mt={4} colorScheme="purple" onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </Box>
      </Flex>
    );
  }

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
              Order: {order.orderNumber}
            </Text>
            <Tag size="md" colorScheme="purple">
              {/* FIXED: Updated to match your supplier data structure */}
              @{supplier?.username || supplier?.name || 'Supplier'}
            </Tag>
          </HStack>
        </VStack>

        {/* Card */}
        <Box bg={cardBg} p={6} rounded="md" boxShadow="lg">
          {/* User Details */}
          <HStack spacing={8} mb={4}>
            <Text fontWeight="medium" color={textColor}>
              Order ID: <span style={{ fontWeight: "bold" }}>{order.orderNumber}</span>
            </Text>
            <Text fontWeight="medium" color={textColor}>
              {/* FIXED: Updated to match your supplier data structure */}
              Supplier: <span style={{ fontWeight: "bold" }}>{supplier?.username || supplier?.name || 'Unknown'}</span>
            </Text>
          </HStack>

          {/* Order Info */}
          <Text color={secondaryColor} mb={4}>
            Order Date: <strong>{new Date(order.orderDate).toLocaleDateString()}</strong>
          </Text>

          {/* Payment Note */}
          <Text fontSize="sm" color={textColor} mb={6}>
            {/* FIXED: Updated to match your supplier data structure */}
            Please complete the payment to process your order with {supplier?.username || supplier?.name || 'the supplier'}.
          </Text>

          {/* Order Summary */}
          <Box mb={6}>
            <Text fontSize="lg" fontWeight="semibold" mb={2} color={textColor}>
              Order Summary
            </Text>
            <VStack spacing={3} align="stretch">
              {order.items && order.items.map((item, index) => (
                <Flex justify="space-between" key={index}>
                  <Text>{item.name || `Item ${index + 1}`}</Text>
                  <Text fontSize="sm" color={secondaryColor}>
                    Qty: {item.quantity || 1}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </Box>

          <Divider my={4} />

          {/* Pricing */}
          <Box mb={6}>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="medium" color={textColor}>Unit Price</Text>
              <Text fontWeight="medium" color={textColor}>
                Rs{(order.orderTotal || 0).toFixed(2)}
              </Text>
            </Flex>
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
            <Text fontSize="lg" fontWeight="bold" color={textColor}>Total Amount</Text>
            <HStack>
              <Text fontSize="md" fontWeight="medium" color="green.400">
                Payment Due
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
            <Button 
              variant="outline" 
              colorScheme="gray" 
              flex={1}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default CheckoutPage;