import React from 'react';
import { Box, Container, Flex, Link, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="#3C0A44" color="white" py={5}>
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }}>
          <Text>&copy; {new Date().getFullYear()} Smart Inventory. All rights reserved.</Text>
          <Flex gap={6} mt={{ base: 4, md: 0 }}>
            <Link href="#" color="whiteAlpha.800">Service</Link>
            <Link href="#" color="whiteAlpha.800">Support</Link>
            <Link href="#" color="whiteAlpha.800">Legal</Link>
            <Link href="#" color="whiteAlpha.800">Join Us</Link>
          </Flex>
        </Flex>
        <Text mt={4} textAlign="center" color="whiteAlpha.800">
          Designed with ❤️ by Dhanujiranasingha
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;