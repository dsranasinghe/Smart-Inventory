import React, { useState } from 'react';
import { Input, InputGroup, InputRightElement, IconButton, Box } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchComponent = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box width="100%" maxWidth="300px"> {/* Compact design */}
      <InputGroup>
        <Input
          placeholder="Search users..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          size="md"
          borderRadius="full"
          focusBorderColor="purple.500"
          bg="gray.100"
          _hover={{ bg: 'gray.200' }}
        />
        <InputRightElement>
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            onClick={handleSearch}
            colorScheme="purple"
            variant="ghost"
            _hover={{ bg: 'purple.100' }}
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchComponent;
