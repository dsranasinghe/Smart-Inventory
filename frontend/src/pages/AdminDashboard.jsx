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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  Select
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Registration form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

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

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const usersArray = Array.isArray(data) ? data : data.users;

        if (!Array.isArray(usersArray)) {
          throw new Error("Invalid data format received");
        }

        setUsers(usersArray);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      toast({
        title: "Registration successful",
        description: `${formData.username} has been registered as ${formData.role}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Refresh user list
      const usersResponse = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await usersResponse.json();
      setUsers(Array.isArray(usersData) ? usersData : usersData.users);

      onClose();
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'staff',
        phoneNumber: '',
        address: ''
      });
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
        <Button colorScheme="purple" onClick={onOpen}>
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
                    bg={getPastelColor(user.username)}
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

      {/* Registration Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Role</FormLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="supplier">Supplier</option>
              </Select>
            </FormControl>

            {/* Supplier-specific fields */}
            {formData.role === 'supplier' && (
              <>
                <FormControl isRequired mt={4}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Address</FormLabel>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleRegister}>
              Register
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;