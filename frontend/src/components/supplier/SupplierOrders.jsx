import {
  Box, Text, Grid, Card, CardHeader, CardBody, CardFooter,
  Badge, useColorModeValue, Tooltip, Avatar, HStack, VStack
} from "@chakra-ui/react";

const SupplierOrders = ({ orders }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.600");
console.log('Orders received in component:', orders);
  if (orders && orders.length > 0) {
    console.log('First order manager data:', orders[0].manager);
  }

  
  return (
    <Box bg={cardBg} p={8} borderRadius="2xl" boxShadow="lg">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Order History
      </Text>

      {orders?.length > 0 ? (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          {orders.map((order) => (
            <Card key={order._id} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md">
              <CardHeader bg={headerBg}>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">
                    Order #{order.orderNumber || `ORD-${order._id.slice(-4)}`}
                  </Text>
                  
                  <HStack>
  <Avatar 
    size="sm" 
    name={order.manager?.username} 
  />
  <Text fontSize="sm" color="gray.600">
    Ordered by: {order.manager?.username || "Unknown"}
  </Text>
</HStack>

                </VStack>
              </CardHeader>
              <CardBody>
                <Text fontSize="sm" mb={2}>
                  <strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                
                {order.expectedDeliveryDate && (
                  <Text fontSize="sm" mb={2}>
                    <strong>Expected Delivery:</strong> {new Date(order.expectedDeliveryDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                )}

                <Tooltip 
                  label={order.items?.map(item => 
                    `${item.quantity}x ${item.item?.name || 'Item'}`
                  ).join(", ")}
                >
                  <Text cursor="pointer" color="blue.500" fontWeight="medium" fontSize="sm" mb={2}>
                    {order.items?.length || 0} items
                  </Text>
                </Tooltip>

                <Text fontWeight="bold" fontSize="lg" color="green.600">
                  Total: ${order.orderTotal?.toFixed(2)}
                </Text>
              </CardBody>
              <CardFooter>
                <Badge
                  px={3}
                  py={1}
                  borderRadius="lg"
                  fontSize="0.85em"
                  colorScheme={
                    order.deliveryStatus === "Delivered" ? "green" :
                    order.deliveryStatus === "Shipped" ? "blue" :
                    order.deliveryStatus === "Processing" ? "orange" : "gray"
                  }
                >
                  {order.deliveryStatus}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      ) : (
        <Text color="gray.500" textAlign="center" mt={4} fontStyle="italic">
          No order history yet
        </Text>
      )}
    </Box>
  );
};

export default SupplierOrders;