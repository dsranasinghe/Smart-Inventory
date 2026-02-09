import { Alert, AlertIcon, Box, AlertTitle, AlertDescription } from "@chakra-ui/react";

const AlertMessage = ({ status, title, message }) => {
  return (
    <Alert 
      status={status} 
      mb={6} 
      borderRadius="lg" 
      variant="left-accent"
      alignItems="flex-start"
    >
      <AlertIcon mt={1} />
      <Box>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Box>
    </Alert>
  );
};

export default AlertMessage;
