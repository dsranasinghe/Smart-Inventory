import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Text,
  Divider
} from '@chakra-ui/react';

import { useAuth } from '../context/AuthContext';
import registerImage from '../assets/login.png';

const Register = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // Default role
  });

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Registration Successful',
          description: 'You have been registered successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Registration Failed',
          description: data.message || 'An error occurred during registration.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
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
        {/* Left Side - Image */}
        <Box flex={1} display={{ base: 'none', md: 'block' }} bg="purple.50" p={8}>
          <img src={registerImage} alt="Register Illustration" style={{ width: '100%', height: 'auto' }} />
        </Box>
        
        {/* Right Side - Form */}
        <Box flex={1} p={8} display="flex" flexDirection="column" justifyContent="center">
          <Text fontSize="2xl" fontWeight="bold" mb={4} color="purple.700">Register</Text>
          <Text color="purple.500" mb={6}>Create an account to manage your inventory efficiently!</Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl id="username" isRequired>
                <FormLabel color="purple.700">Username</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  borderColor="purple.300"
                  focusBorderColor="purple.500"
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel color="purple.700">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  borderColor="purple.300"
                  focusBorderColor="purple.500"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel color="purple.700">Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  borderColor="purple.300"
                  focusBorderColor="purple.500"
                />
              </FormControl>

              {user?.role === 'admin' && (
                <FormControl id="role" isRequired>
                  <FormLabel color="purple.700">Role</FormLabel>
                  <Select
                    placeholder="Select role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    borderColor="purple.300"
                    focusBorderColor="purple.500"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                    <option value="supplier">Supplier</option>
                  </Select>
                </FormControl>
              )}

              <Button type="submit" colorScheme="purple" width="full" mt={4} borderRadius="md">
                Register
              </Button>
            </VStack>
          </form>
          <Divider my={6} borderColor="purple.300" />
          <Text textAlign="center">
            Already have an account? <Text as="span" color="purple.500" cursor="pointer">Login here</Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
