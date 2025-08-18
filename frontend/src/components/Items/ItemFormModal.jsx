import {
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
  Select,
  Button,
  VStack
} from "@chakra-ui/react";

const ItemFormModal = ({
  isOpen,
  onClose,
  item,
  onChange,
  onSubmit,
  title,
  submitButtonText,
  borderColor
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent borderRadius="xl">
        <ModalHeader 
          borderBottom="1px solid" 
          borderColor={borderColor}
          fontSize="xl"
        >
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack spacing={5}>
            <FormControl isRequired>
              <FormLabel>Item Name</FormLabel>
              <Input
                value={item.name}
                onChange={(e) => onChange('name', e.target.value)}
                size="lg"
                focusBorderColor="blue.500"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={item.description}
                onChange={(e) => onChange('description', e.target.value)}
                size="lg"
                focusBorderColor="blue.500"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Unit Price ($)</FormLabel>
              <Input
                type="number"
                value={item.unitPrice}
                onChange={(e) => onChange('unitPrice', e.target.value)}
                size="lg"
                focusBorderColor="blue.500"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Delivery Type</FormLabel>
              <Select
                value={item.deliveryType}
                onChange={(e) => onChange('deliveryType', e.target.value)}
                size="lg"
                focusBorderColor="blue.500"
              >
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
                <option value="Overnight">Overnight</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Stock Status</FormLabel>
              <Select
                value={item.inStock}
                onChange={(e) => onChange('inStock', e.target.value === "true")}
                size="lg"
                focusBorderColor="blue.500"
              >
                <option value={true}>In Stock</option>
                <option value={false}>Out of Stock</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter 
          borderTop="1px solid" 
          borderColor={borderColor}
          pt={4}
        >
          <Button 
            colorScheme="blue" 
            mr={3} 
            onClick={onSubmit}
            size="lg"
            px={6}
          >
            {submitButtonText}
          </Button>
          <Button 
            onClick={onClose}
            variant="ghost"
            size="lg"
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItemFormModal;