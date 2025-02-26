import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  FaUserShield,
  FaCreditCard,
  FaChartLine,
  FaBell,
  FaEnvelope,
  FaBoxOpen,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from '../components/footer';
import homelogo from '../assets/landing.jpg';
import Navbar from '../components/navbar';

const HomePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (

    <Box>
      <Navbar />
      {/* Hero Section */}
      <Box color="black" py={20}>
        <Container maxW="container.lg">
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
            <VStack align="start" spacing={6}>
              <Heading as="h1" size="2xl">
                Streamline Your Grocery Inventory with Ease
              </Heading>
              <Text fontSize="xl">
                Optimize, track, and manage your inventory in real time with Smart Inventory
              </Text>
              <Flex gap={4}>
                <Button colorScheme="purple" size="lg" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
                <Button variant="outline" colorScheme="blackAlpha" size="lg">
                  How it works
                </Button>
              </Flex>
            </VStack>
            <Box>
              {/* Add an image or illustration here */}
              <Image
                src={homelogo}
                alt="Inventory Management"
                borderRadius="lg"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Never Run Out of Stock Section */}
      <Box py={20}>
        <Container maxW="container.lg">
          <VStack spacing={6} align="center" textAlign="center">
            <Heading as="h2" size="xl">
              Never Run Out of Stock Again
            </Heading>
            <Text fontSize="lg" maxW="2xl">
              With Smart Inventory, you’ll never have to worry about running out of stock again. Our
              real-time tracking, smart alerts, and automated stocking makes inventory management
              simple and reliable, ensuring you always have what you need, when you need it—every
              time, all the time!
            </Text>
            <Flex gap={4}>
             
              <Button  bg="#3C0A44" colorScheme="white" size="lg" onClick={() => navigate('/login')}>
                Login
              </Button>
            </Flex>
          </VStack>
        </Container>
      </Box>

      {/* Services Section */}
      <Box bg="gray.50" py={20}>
        <Container maxW="container.lg">
          <VStack spacing={10} align="center">
            <Heading as="h2" size="xl">
              Our Capabilities
            </Heading>
            <Text fontSize="lg" maxW="2xl" textAlign="center">
              We will bring the breadth of our experience and industry knowledge to help you succeed!
            </Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
              {/* Service 1 */}
              <Box bg="white" p={6} borderRadius="lg" boxShadow="md" textAlign="center">
                <Box as={FaUserShield} size="2rem" color="purple.300" mb={4} />
                <Heading as="h3" size="md" mb={4}>
                  Role-Based Authorization
                </Heading>
                <Text>
                  Ensure system security with tailored access for Admins, Managers, Staff, and
                  Suppliers.
                </Text>
              </Box>

              {/* Service 2 */}
              <Box bg="white" p={6} borderRadius="lg" boxShadow="md" textAlign="center">
                <Box as={FaCreditCard} size="2rem" color="purple.300" mb={4} />
                <Heading as="h3" size="md" mb={4}>
                  Integrated Payment Gateway
                </Heading>
                <Text>
                  Enable seamless and secure payment processing for all transactions.
                </Text>
              </Box>

              {/* Service 3 */}
              <Box bg="white" p={6} borderRadius="lg" boxShadow="md" textAlign="center">
                <Box as={FaChartLine} size="2rem" color="purple.300" mb={4} />
                <Heading as="h3" size="md" mb={4}>
                  Reports & Analytics
                </Heading>
                <Text>
                  Generate detailed reports and insights for better decision-making and strategic
                  planning.
                </Text>
              </Box>

              {/* Service 4 */}
              <Box bg="white" p={6} borderRadius="lg" boxShadow="md" textAlign="center">
                <Box as={FaBell} size="2rem" color="purple.300" mb={4} />
                <Heading as="h3" size="md" mb={4}>
                  Smart Notification System
                </Heading>
                <Text>
                  Receive real-time alerts for low stock, expiring items, and other critical updates.
                </Text>
              </Box>

              {/* Service 5 */}
              <Box bg="white" p={6} borderRadius="lg" boxShadow="md" textAlign="center">
                <Box as={FaEnvelope} size="2rem" color="purple.300" mb={4} />
                <Heading as="h3" size="md" mb={4}>
                  Email Automation
                </Heading>
                <Text>
                  Automate email notifications for suppliers, staff, and managers.
                </Text>
              </Box>

              {/* Service 6 */}
              <Box bg="white" p={6} borderRadius="lg" boxShadow="md" textAlign="center">
                <Box as={FaBoxOpen} size="2rem" color="purple.300" mb={4} />
                <Heading as="h3" size="md" mb={4}>
                  Advanced Inventory Management
                </Heading>
                <Text>
                  Track inventory in real-time and optimize stock levels with advanced tools.
                </Text>
              </Box>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Footer Section */}
      <Footer />
    </Box>
  );
};

export default HomePage;