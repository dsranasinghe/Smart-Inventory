import {
  Box, Text, Grid, Card, CardHeader, CardBody, CardFooter,
  Badge, useColorModeValue, Tooltip, Button
} from "@chakra-ui/react";

const SupplierOrders = ({ orders }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.600");

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
                <Text fontWeight="bold">
                  Order #{order.orderNumber || `ORD-${order._id.slice(-4)}`}
                </Text>
              </CardHeader>
              <CardBody>
                <Text>
                  Date: {new Date(order.orderDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Tooltip label={order.items?.map(i => i.name).join(", ")}>
                  <Text cursor="pointer" color="blue.500" fontWeight="medium">
                    {order.items?.length || 0} items
                  </Text>
                </Tooltip>
                <Text fontWeight="bold" mt={2}>
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
                    order.deliveryStatus === "Delivered"
                      ? "green"
                      : order.deliveryStatus === "Shipped"
                      ? "blue"
                      : "orange"
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
