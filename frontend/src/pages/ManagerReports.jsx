import React, { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Select,
  Alert,
  AlertIcon,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Icon,
  Divider,
  useToast,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  FaArrowUp,
  FaArrowDown,
  FaBox,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import Sidebar from "../components/sidebar";
import { PDFDocument } from "./PDFDocument";


const inventoryStats = [
  { label: "Total Stock Value", value: 1250000, trend: "up", change: "+5%", icon: FaDollarSign },
  { label: "Items Near Expiry", value: 24, trend: "up", change: "+3", icon: FaExclamationTriangle },
  { label: "Categories", value: 12, trend: "stable", change: "0", icon: FaBox },
  { label: "Stock Turnover", value: "78%", trend: "down", change: "-4%", icon: FaCalendarAlt },
];

const expiryData = [
  { category: "Dairy", items: 5, risk: "High" },
  { category: "Produce", items: 12, risk: "High" },
  { category: "Meat", items: 3, risk: "Medium" },
  { category: "Bakery", items: 4, risk: "Medium" },
  { category: "Frozen", items: 2, risk: "Low" },
];

const stockTurnoverData = [
  { month: "Jan", turnover: 65, spoilage: 5 },
  { month: "Feb", turnover: 72, spoilage: 3 },
  { month: "Mar", turnover: 68, spoilage: 4 },
  { month: "Apr", turnover: 78, spoilage: 2 },
  { month: "May", turnover: 75, spoilage: 3 },
  { month: "Jun", turnover: 82, spoilage: 1 },
];

const categoryDistribution = [
  { name: "Dairy", value: 35 },
  { name: "Produce", value: 25 },
  { name: "Meat", value: 15 },
  { name: "Bakery", value: 15 },
  { name: "Frozen", value: 10 },
];

const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#8884D8"];

const spoilageAlerts = [
  { type: "warning", message: "24 items expiring within 7 days. Review inventory." },
  { type: "info", message: "Stock turnover rate improved by 5% this month." },
  { type: "success", message: "Spoilage rate below target for 3 consecutive months." },
];

// ================== Revised Dashboard Component ================== //
const PerishableGoodsDashboard = () => {
  const [timeRange, setTimeRange] = useState("Monthly");
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Create report data object
      const reportData = {
        title: "Perishable Goods Inventory Report",
        generatedDate: new Date().toLocaleDateString(),
        timeRange: timeRange,
        inventoryStats: inventoryStats,
        expiryData: expiryData,
        stockTurnoverData: stockTurnoverData,
        categoryDistribution: categoryDistribution,
        spoilageAlerts: spoilageAlerts,
        summary: {
          totalHighRiskItems: expiryData.filter(item => item.risk === "High").reduce((sum, item) => sum + item.items, 0),
          highRiskCategories: expiryData.filter(item => item.risk === "High").length,
          averageTurnover: Math.round(stockTurnoverData.reduce((sum, item) => sum + item.turnover, 0) / stockTurnoverData.length),
        }
      };

      // Generate PDF
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(<PDFDocument data={reportData} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Perishable-Goods-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: "PDF report has been downloaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Flex bg="gray.50" minH="100vh">
      {/* Sidebar */}
      <Sidebar userRole="manager" />

      {/* Dashboard Main Content */}
      <Box flex="1" p={6} ml="250px"> 
        <VStack spacing={6} w="full" align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center" pb={4}>
            <VStack align="start" spacing={1}>
              <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                Perishable Goods Dashboard Report
              </Text>
            
            </VStack>
            <HStack spacing={4}>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                w="180px"
                bg="white"
              >
                <option value="Daily">Daily View</option>
                <option value="Weekly">Weekly View</option>
                <option value="Monthly">Monthly View</option>
                <option value="Quarterly">Quarterly View</option>
              </Select>
              <Button 
                leftIcon={<FaBox />} 
                colorScheme="blue" 
                variant="solid"
                onClick={handleGenerateReport}
                isLoading={isGenerating}
                loadingText="Generating..."
              >
                Generate Report
              </Button>
            </HStack>
          </Flex>

          {/* Inventory Overview Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {inventoryStats.map((stat, idx) => (
              <Card key={idx} bg="white" shadow="md" borderRadius="xl">
                <CardBody>
                  <HStack justify="space-between" align="flex-start">
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        {stat.label}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {typeof stat.value === 'number' && stat.label.includes('Value') 
                          ? `Rs ${stat.value.toLocaleString()}` 
                          : stat.value}
                      </Text>
                      <HStack>
                        {stat.trend === "up" ? (
                          <FaArrowUp color="green" size="14px" />
                        ) : stat.trend === "down" ? (
                          <FaArrowDown color="red" size="14px" />
                        ) : null}
                        <Text
                          fontSize="sm"
                          color={stat.trend === "up" ? "green.500" : stat.trend === "down" ? "red.500" : "gray.500"}
                        >
                          {stat.change} {stat.trend === "stable" ? "this month" : ""}
                        </Text>
                      </HStack>
                    </VStack>
                    <Icon as={stat.icon} boxSize={6} color="blue.500" />
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Charts */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Stock Turnover Trend */}
            <Card bg="white" shadow="md" borderRadius="xl">
              <CardHeader pb={2}>
                <Heading size="md">Stock Turnover & Spoilage Rate</Heading>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stockTurnoverData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="turnover" stroke="#8884d8" strokeWidth={2} name="Turnover Rate %" />
                    <Line yAxisId="right" type="monotone" dataKey="spoilage" stroke="#ff7f50" strokeWidth={2} name="Spoilage %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Category Distribution */}
            <Card bg="white" shadow="md" borderRadius="xl">
              <CardHeader pb={2}>
                <Heading size="md">Inventory by Category</Heading>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Expiry Risk Analysis */}
          <Card bg="white" shadow="md" borderRadius="xl">
            <CardHeader pb={2}>
              <Heading size="md">Expiry Risk Analysis by Category</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Category</Th>
                    <Th>Items Near Expiry</Th>
                    <Th>Risk Level</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {expiryData.map((category, idx) => (
                    <Tr key={idx}>
                      <Td fontWeight="medium">{category.category}</Td>
                      <Td>{category.items} items</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            category.risk === "High" ? "red" : category.risk === "Medium" ? "orange" : "green"
                          }
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {category.risk} Risk
                        </Badge>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme={category.risk === "High" ? "red" : category.risk === "Medium" ? "orange" : "green"}
                          variant="outline"
                        >
                          View Details
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>

          {/* Comprehensive Analysis (Replaces Low Stock Alerts) */}
          <Card bg="white" shadow="md" borderRadius="xl">
            <CardHeader pb={2}>
              <Heading size="md">Comprehensive Inventory Analysis</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="sm" color="gray.700">
                  ✅ <b>Expiry Concentration:</b> {expiryData.filter(e => e.risk === "High").length} categories flagged with high expiry risks. Immediate stock clearance strategies recommended.
                </Text>
                <Divider />
                <Text fontSize="sm" color="gray.700">
                  📊 <b>Turnover Insights:</b> Average turnover rate is <b>74%</b> with a downward trend in May (-4%). Fresh produce cycle needs acceleration.
                </Text>
                <Divider />
                <Text fontSize="sm" color="gray.700">
                  🥛 <b>Category Concentration:</b> Dairy and Produce represent over <b>60%</b> of perishable stock. A disruption here directly impacts overall spoilage.
                </Text>
                <Divider />
                <Text fontSize="sm" color="gray.700">
                  🚀 <b>Performance Highlight:</b> Spoilage rate has been consistently below 3% for the last quarter, a strong efficiency indicator.
                </Text>
              </VStack>
            </CardBody>
          </Card>

          {/* Spoilage Alerts */}
          <Card bg="white" shadow="md" borderRadius="xl">
            <CardHeader pb={2}>
              <Heading size="md">Inventory Insights</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {spoilageAlerts.map((alert, idx) => (
                  <Alert key={idx} status={alert.type} variant="subtle" borderRadius="md">
                    <AlertIcon />
                    {alert.message}
                  </Alert>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </Flex>
  );
};

export default PerishableGoodsDashboard;