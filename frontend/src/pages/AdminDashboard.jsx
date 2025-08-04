import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SearchComponent from "../components/search";

// Function to generate a pastel color based on a string
const getPastelColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360; 
  return `hsl(${hue}, 70%, 80%)`; 
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        console.log("Token:", token);

        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response Data:", data); // Log the full response

        // Fix: Extract 'users' array if API response is wrapped in an object
        const usersArray = Array.isArray(data) ? data : data.users;

        if (!Array.isArray(usersArray)) {
          throw new Error("Invalid data format received");
        }

        console.log("Users Array:", usersArray); // Log the users array
        setUsers(usersArray);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetchUsers function
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filtered users based on search query
  const filteredUsers = users.filter((user) => {
    const username = user.username || ""; 
    return username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={6}>
        Admin Dashboard
      </Heading>

      {/* Register Button & Search Component */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Button colorScheme="purple" onClick={() => navigate("/register")}>
          Register New User
        </Button>
        <SearchComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Box>

      {error && (
        <Box color="red.500" mb={4}>
          <Text>Error loading users: {error}</Text>
        </Box>
      )}

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>User Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((user) => (
              <Tr key={user._id}>
                <Td display="flex" alignItems="center">
                  <Avatar
                    size="sm"
                    name={user.username}
                    src={user.profilePic}
                    bg={getPastelColor(user.username)} // Set pastel background color
                    mr={2}
                  />
                  <Text>{user.username}</Text>
                </Td>
                <Td>
                  <Text>{user.role}</Text>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => navigate(`/users/${user._id}`)}
                  >
                    View Profile
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Button mt={6} colorScheme="red" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default AdminDashboard;