import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  useColorModeValue,
  HStack,
  Divider,
  Badge,
  Spinner,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Sidebar from "../components/sidebar";

const PaymentPage = () => {
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [lastChecked, setLastChecked] = useState(new Date());
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pollingRef = useRef(null);

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const notificationBg = useColorModeValue("gray.50", "gray.800");

  
useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/orders/manager",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Filter only pending payments
      const pendingOrders = res.data.filter(order => order.paymentStatus === 'Pending');
      setOrders(pendingOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchOrders();
}, []);
  // ✅ Simple polling for new orders
  useEffect(() => {
    const checkForNewOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/orders/check-new?lastChecked=${lastChecked.toISOString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.hasNewOrders) {
          // Show alert and update notifications
          setShowNewOrderAlert(true);

          // Add to notifications
          const newNotification = {
            _id: Date.now().toString(),
            message: "New order received",
            timestamp: new Date(),
            read: false,
            type: "new_order",
          };

          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Refresh orders list
          const ordersRes = await axios.get(
            "http://localhost:5000/api/orders/manager",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setOrders(ordersRes.data);

          // Update last checked time
          setLastChecked(new Date());
        }
      } catch (error) {
        console.error("Error checking for new orders:", error);
      }
    };

    // Check every 30 seconds
    pollingRef.current = setInterval(checkForNewOrders, 30000);

    // Clean up on component unmount
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [lastChecked]);

  // ✅ Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => prev - 1);
  };

  // ✅ Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // ✅ Format currency for LKR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

 const handlePayment = (orderId) => {
  navigate(`/payment/checkout/${orderId}`); 
};

  // ✅ Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Flex>
      <Sidebar />
      <Box p={6} flex={1}>
        {/* New Order Alert */}
        {showNewOrderAlert && (
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>New Order Received!</AlertTitle>
              <AlertDescription>
                A new order has been placed and requires your attention.
              </AlertDescription>
            </Box>
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={() => setShowNewOrderAlert(false)}
            />
          </Alert>
        )}

        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold">
            Supplier Payments
          </Text>

          {/* Notification Bell */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Notifications"
              icon={
                <Box position="relative">
                  <BellIcon boxSize={6} />
                  {unreadCount > 0 && (
                    <Badge
                      position="absolute"
                      top="-2"
                      right="-2"
                      borderRadius="full"
                      colorScheme="red"
                      fontSize="0.7em"
                      minW="5"
                      minH="5"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Box>
              }
              variant="ghost"
            />
            <MenuList maxH="400px" overflowY="auto" zIndex="popover">
              <Flex px={3} py={2} justify="space-between" align="center">
                <Text fontWeight="bold">Notifications</Text>
                {unreadCount > 0 && (
                  <Button size="xs" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </Flex>
              <Divider />

              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <MenuItem
                    key={notification._id}
                    py={3}
                    bg={notification.read ? "transparent" : notificationBg}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <VStack align="start" spacing={1}>
                      <Text
                        fontSize="sm"
                        fontWeight={notification.read ? "normal" : "bold"}
                      >
                        {notification.message}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatDate(notification.timestamp)}
                      </Text>
                    </VStack>
                  </MenuItem>
                ))
              ) : (
                <Text px={3} py={2} fontSize="sm" color="gray.500">
                  No notifications
                </Text>
              )}
            </MenuList>
          </Menu>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="lg" />
          </Flex>
        ) : orders?.length > 0 ? (
          <VStack spacing={6} align="stretch">
            {orders.map((order) => (
              <Box
                key={order._id}
                bg={cardBg}
                p={6}
                rounded="md"
                boxShadow="md"
                _hover={{ transform: "scale(1.01)", transition: "0.2s ease" }}
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      {order.supplier?.user?.username || "Unknown Supplier"}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {order.supplier?.user?.email}
                    </Text>
                  </Box>
                  <Badge colorScheme="orange">
                    Due:{" "}
                    {order.paymentDueDate
                      ? new Date(order.paymentDueDate).toLocaleDateString()
                      : "N/A"}
                  </Badge>
                </Flex>

                <Divider mb={4} />

                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold" color="purple.500">
                    {formatCurrency(order.orderTotal)}
                  </Text>
                  <Button
                    colorScheme="purple"
                    onClick={() => handlePayment(order._id)} 
                  >
                    Proceed to Payment
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text color="gray.500" textAlign="center" mt={4} fontStyle="italic">
            No unpaid orders available
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default PaymentPage;
