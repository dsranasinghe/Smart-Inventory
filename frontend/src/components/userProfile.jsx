import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Avatar, Spinner, Button } from '@chakra-ui/react';

const UserProfile = () => {
  const { userId } = useParams(); // Get the userId from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log('User ID from URL:', userId); // Debugging: Log the userId

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }

        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data); // Set the user data directly
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Box color="red.500">
        <Text>Error loading user: {error}</Text>
      </Box>
    );
  }

  if (!user) {
    return <Text>User not found.</Text>;
  }

  return (
    <Box p={8}>
      <Button colorScheme="blue" onClick={() => navigate(-1)} mb={4}>
        Back to Dashboard
      </Button>
      <Heading as="h1" size="xl" mb={6}>
        User Profile
      </Heading>
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar size="xl" name={user.name} src={user.profilePic} mr={4} />
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {user.name}
          </Text>
          <Text fontSize="lg" color="gray.600">
            {user.role}
          </Text>
        </Box>
      </Box>
      <Box>
        <Text fontSize="lg" mb={2}>
          <strong>Email:</strong> {user.email}
        </Text>
        <Text fontSize="lg" mb={2}>
          <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
        </Text>
        {/* Add more user details here */}
      </Box>
    </Box>
  );
};

export default UserProfile;