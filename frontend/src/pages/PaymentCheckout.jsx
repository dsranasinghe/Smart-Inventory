import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  useColorModeValue,
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
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const supplierName = location.state?.supplierName || "Unknown Supplier";
  const navigate = useNavigate();
  const toast = useToast();

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryColor = useColorModeValue("gray.500", "gray.300");
  const inputBg = useColorModeValue("gray.100", "gray.600");

  // State
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("payhere");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [user, setUser] = useState(null);

  // Get user data from localStorage on component mount
  useEffect(() => {
    const getUserData = () => {
      try {
        // Try all possible storage keys used in your app
        const userData = 
          localStorage.getItem("currentUser") || 
          localStorage.getItem("user") || 
          localStorage.getItem("users");
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log("User data loaded:", parsedUser);
        } else {
          console.warn("No user data found in localStorage");
          // Redirect to login if no user data found
          toast({
            title: "Authentication Required",
            description: "Please log in to continue with payment",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          navigate("/login");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user information",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
      }
    };

    getUserData();
  }, [navigate, toast]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderData = async () => {
      // Don't fetch order data if user is not authenticated
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Please log in to continue",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          navigate("/login");
          return;
        }

        const orderRes = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!orderRes.data) throw new Error("No order data returned from API");

        setOrder(orderRes.data);

        // Handle different supplier data structures
        if (orderRes.data.supplier) {
          // Case 1: Supplier is an embedded object with user data
          if (
            orderRes.data.supplier.user &&
            orderRes.data.supplier.user.username
          ) {
            setSupplier(orderRes.data.supplier);
          }
          // Case 2: Supplier is just an ID string, need to fetch details
          else if (typeof orderRes.data.supplier === "string") {
            try {
              const supplierRes = await axios.get(
                `http://localhost:5000/api/suppliers/${orderRes.data.supplier}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              setSupplier(supplierRes.data);
            } catch (supplierError) {
              console.warn("Failed to fetch supplier details:", supplierError);
              // Fallback: create a minimal supplier object
              setSupplier({
                username: "Unknown Supplier",
                _id: orderRes.data.supplier,
              });
            }
          }
          // Case 3: Supplier is already a full object but with different structure
          else if (
            orderRes.data.supplier.username ||
            orderRes.data.supplier.name
          ) {
            setSupplier(orderRes.data.supplier);
          } else {
            console.warn(
              "Unexpected supplier data structure:",
              orderRes.data.supplier
            );
            setSupplier({
              username: "Unknown Supplier",
              ...orderRes.data.supplier,
            });
          }
        } else {
          console.warn("No supplier data found in order");
          setSupplier({ username: "Unknown Supplier" });
        }

      } catch (error) {
        console.error("Error fetching order data:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to load order details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoadingData(false);
      }
    };

    if (orderId && user) {
      fetchOrderData();
    } else if (!orderId) {
      toast({
        title: "Error",
        description: "No order ID provided",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoadingData(false);
    }
  }, [orderId, toast, navigate, user]);

  // Get supplier contact information
  const getSupplierContact = () => {
  
    if (order?.supplier) {
      return {
        phone: order.supplier.phone || "0000000000",
        address: order.supplier.address || "No address provided"
      };
    }
    
    // Fallback to user data if supplier data isn't available
    return {
      phone: user?.phone || "0771234567",
      address: user?.address || "Colombo, Sri Lanka"
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a payment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    if (!order) {
      toast({
        title: "Error",
        description: "Order data not available",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (quantity < 1) {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be at least 1",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use the existing PayHere payment handler
      await handlePayHerePayment();
    } catch (error) {
      console.error("Payment submission failed:", error);
      setIsLoading(false);
    }
  };


  // REAL PayHere payment handler
  const handlePayHerePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!user) {
        throw new Error("User information not found. Please log in again.");
      }

      if (!order) throw new Error("Order data not available");
      if (typeof window.payhere === "undefined")
        throw new Error(
          "PayHere payment gateway not loaded. Please refresh the page."
        );

      const supplierContact = getSupplierContact();
      
      // 1. Get payment hash from backend
      const response = await axios.post(
        "http://localhost:5000/api/payments/generate-hash",

        { 
          order_id: order.orderNumber, 
          amount: total 
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.hash)
        throw new Error("Failed to generate payment hash");

      const { hash, merchantId, amount, currency } = response.data;


      // 2. Create payment object with safe fallbacks

      const payment = {
        sandbox: true,
        merchant_id: merchantId,
        return_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/payment-cancel`,
        notify_url: "https://2e9450ba7cad.ngrok-free.app/api/payments/notify",
        order_id: order.orderNumber,
        items: `Payment for Order ${order.orderNumber}`,

        amount: amount,
        currency: currency,
        hash: hash,

        first_name: user?.first_name || user?.username || "Customer",
        last_name: user?.last_name || " ",
        email: user?.email || "customer@example.com",
        phone: supplierContact.phone,
        address: supplierContact.address,
        city: "Colombo",
        country: "Sri Lanka",

        custom_1: user?._id || user?.id || "user_id",
        custom_2: order.supplier?._id || order.supplier?.id || order.supplier || "supplier_id",
      };

      console.log("Payment object:", payment);

      // 3. Set up payment handlers
      window.payhere.onCompleted = function (onCompletedOrderId) {
        console.log("Payment completed. OrderID:", onCompletedOrderId);
        setIsLoading(false);
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/payment-success");
      };

        custom_1: user?._id || "manager_id",
        custom_2: order.supplier?._id || order.supplier,
      };

      // 3. Set up PayHere callbacks
     window.payhere.onCompleted = async function (onCompletedOrderId) {
  console.log("Payment completed. OrderID:", onCompletedOrderId);

  const supplierId =
    typeof order.supplier.user === "string"
      ? order.supplier.user
      : order.supplier._id;

  console.log("Order ID:", order._id);
  console.log("Supplier ID:", supplierId);
  console.log("Manager ID:", user?._id);
  console.log("Total amount:", total);

  if (!user?._id) {
    toast({
      title: "Error",
      description: "Manager ID not found. Cannot save payment.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/payments/manual",
      {
        order_id: order._id,
        payment_id: "PH_" + new Date().getTime(),
        amount: Number(total),
        currency: "LKR",
        supplier_id: supplierId,
        manager_id: user._id,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast({
      title: "Payment Successful",
      description: "Your payment has been recorded successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  } catch (err) {
    console.error("Failed to save payment manually:", err);
    toast({
      title: "Payment Save Failed",
      description:
        "Payment completed but could not be recorded. Contact support.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  navigate("/payment-success");
};


      window.payhere.onDismissed = function () {
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

      window.payhere.onError = function (error) {
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

      // 4. Start PayHere payment
      window.payhere.startPayment(payment);

    } catch (error) {
      console.error("Payment initiation failed:", error);
      setIsLoading(false);
      toast({
        title: "Payment Failed",
        description:
          error.message || "Failed to initialize payment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // 🎯 Calculate totals safely
  const subtotal = order ? (order.orderTotal || 0) : 0;
  const total = subtotal * quantity;

  // Show loading if still checking authentication or fetching data
  if (loadingData || !user) {
    return (
      <Flex>
        <Sidebar />
        <Box
          flex={1}
          p={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack spacing={4}>
            <Spinner size="xl" color="purple.500" />
            <Text color={textColor}>
              {!user ? "Checking authentication..." : "Loading order details..."}
            </Text>
          </VStack>
        </Box>
      </Flex>
    );
  }

  // No order found
  if (!order) {
    return (
      <Flex>
        <Sidebar />
        <Box flex={1} p={8}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">Order not found</Text>
              <Text fontSize="sm">
                The requested order could not be loaded.
              </Text>
            </VStack>
          </Alert>
          <Button
            mt={4}
            colorScheme="purple"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </Button>
        </Box>
      </Flex>
    );
  }

  // Main UI
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
              @{supplierName}
            </Tag>
          </HStack>
        </VStack>

        {/* Card */}
        <Box bg={cardBg} p={6} rounded="md" boxShadow="lg">
          {/* Order Info */}
          <HStack spacing={8} mb={4}>
            <Text fontWeight="medium" color={textColor}>
              Order ID: <strong>{order.orderNumber}</strong>
            </Text>
            <Text fontWeight="medium" color={textColor}>
              Supplier: <strong>{supplierName}</strong>
            </Text>
          </HStack>

          <Text color={secondaryColor} mb={4}>
            Order Date:{" "}
            <strong>{new Date(order.orderDate).toLocaleDateString()}</strong>
          </Text>

          <Text fontSize="sm" color={textColor} mb={6}>
            Please complete the payment to process your order with{" "}
            {supplierName}.
          </Text>

          <Divider my={4} />

          {/* Pricing */}
          <Box mb={6}>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="medium" color={textColor}>
                Unit Price
              </Text>
              <Text fontWeight="medium" color={textColor}>
                Rs{(order.orderTotal || 0).toFixed(2)}
              </Text>
            </Flex>

            <Flex justify="space-between" align="center" mt={4}>
              <Text fontWeight="bold" color={textColor}>
                Quantity
              </Text>
              <Input
                size="sm"
                w="80px"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setQuantity(value >= 1 ? value : 1);
                }}
                bg={inputBg}
              />
            </Flex>
          </Box>

          <Divider my={4} />

          {/* Total */}
          <Flex justify="space-between" align="center" mb={6}>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Total Amount
            </Text>
            <HStack>
              <Text fontSize="md" fontWeight="medium" color="green.400">
                Payment Due
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="purple.500">
                Rs{total.toFixed(2)}
              </Text>
            </HStack>
          </Flex>

          {/* Payment Method (PayHere only) */}
          <Box mb={6}>
            <Text fontSize="lg" fontWeight="semibold" mb={3} color={textColor}>
              Payment Method
            </Text>
            <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
              <Stack direction="column" spacing={3}>
                <Radio value="payhere">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">PayHere</Text>
                    <Text fontSize="sm" color={secondaryColor}>
                      Pay securely with credit/debit card or wallet
                    </Text>
                  </VStack>
                </Radio>
              </Stack>
            </RadioGroup>
          </Box>

          <Divider my={4} />

          {/* Actions */}
          <HStack spacing={4}>
            <Button
              colorScheme="purple"
              flex={1}
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Processing..."
              isDisabled={!order || !user}
            >
              Pay Now
            </Button>
            <Button
              variant="outline"
              colorScheme="gray"
              flex={1}
              onClick={() => navigate(-1)}
              isDisabled={isLoading}
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