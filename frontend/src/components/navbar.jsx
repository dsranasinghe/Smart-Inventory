import React from 'react';
import { useAuth } from '../context/AuthContext'; 
import { Box, Button, Flex, Spacer, Text, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth(); // Access user and logout from AuthContext
  const navigate = useNavigate();

  return (
    <Box bg="white" p={4} boxShadow="sm" color="black">
      <Flex alignItems="center" maxW="1200px" mx="auto">
        <Text fontSize="xl" fontWeight="bold">Inventory Management System</Text>
        <Spacer />

        {/* Navigation Links */}
        <Flex gap={6} alignItems="center">
          <Link href="/pricing" fontSize="md" color="black">Pricing</Link>
          <Link href="/contact" fontSize="md" color="black">Contact</Link>
          
          {/* Authentication Buttons */}
          {user ? (
            <Button colorScheme="red" onClick={logout} size="sm">Logout</Button>
          ) : (
            <>
              <Button variant="outline" colorScheme="blackAlpha" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
              <Button bg="#3C0A44" color="white" size="sm" onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
