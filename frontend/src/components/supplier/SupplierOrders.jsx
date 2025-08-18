import {
  Box, Text, Table, Thead, Tbody, Tr, Th, Td,
  Badge, useColorModeValue
} from "@chakra-ui/react";

const SupplierOrders = ({ orders }) => {
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={4}>Order History</Text>
      {orders?.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Order #</Th>
              <Th>Date</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>{order.orderNumber || `ORD-${order._id.slice(-4)}`}</Td>
                <Td>{new Date(order.orderDate).toLocaleDateString()}</Td>
                <Td>{order.items?.length || 0} items</Td>
                <Td>${order.orderTotal?.toFixed(2)}</Td>
                <Td>
                  <Badge 
                    colorScheme={
                      order.deliveryStatus === "Delivered" ? "green" :
                      order.deliveryStatus === "Shipped" ? "blue" : "orange"
                    }
                  >
                    {order.deliveryStatus}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>No order history yet</Text>
      )}
    </Box>
  );
};

export default SupplierOrders;