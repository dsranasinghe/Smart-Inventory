import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Checkbox,
  Text,
  Link,
  VStack,
  HStack,
  Divider,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import loginImage from '../assets/login.png';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Login failed');
      }

      const data = await response.json();

      // Save the token to localStorage
      localStorage.setItem('token', data.token);

      // Save user data in context
      login(data.user);

      // Redirect based on role
      switch (data.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'manager':
          navigate('/manager');
          break;
        case 'staff':
          navigate('/staff');
          break;
        case 'supplier':
          navigate('/supplier/:supplierId');
          break;
        default:
          navigate('/');
      }

      // Show success toast
      toast({
        title: 'Login Successful',
        description: 'You have been logged in successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error:', error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bg="#f3e8ff">
      <Box display="flex" bg="white" boxShadow="xl" borderRadius="lg" overflow="hidden" width={{ base: '90%', md: '60%', lg: '50%' }}>
        {/* Left Side - Form */}
        <Box flex={1} p={8} display="flex" flexDirection="column" justifyContent="center">
          <Text fontSize="2xl" fontWeight="bold" mb={4} color="purple.700">Login</Text>
          <Text color="purple.500" mb={6}>Efficient Inventory Control at Your Fingertips!</Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl id="email" isRequired>
                <FormLabel color="purple.700">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  borderColor="purple.300"
                  focusBorderColor="purple.500"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel color="purple.700">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    borderColor="purple.300"
                    focusBorderColor="purple.500"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      color="purple.500"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <HStack justifyContent="space-between" width="full">
                <Checkbox colorScheme="purple">Remember me</Checkbox>
                <Link color="purple.500" href="#">Forgot password?</Link>
              </HStack>

              <Button type="submit" colorScheme="purple" width="full" mt={4} borderRadius="md">
                Login
              </Button>
            </VStack>
          </form>

          <Divider my={6} borderColor="purple.300" />
          <Text textAlign="center">
            Not registered yet? <Link color="purple.500" href="#">Create a new account</Link>
          </Text>
        </Box>

        {/* Right Side - Illustration */}
        <Box flex={1} display={{ base: 'none', md: 'block' }} bg="purple.50" p={8}>
          <img src={loginImage} alt="Login Illustration 01" style={{ width: '100%', height: 'auto' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;