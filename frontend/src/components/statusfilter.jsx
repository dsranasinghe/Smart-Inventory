import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
  } from "@chakra-ui/react";
  
  const statuses = ["All", "In Stock", "Low Stock", "Out of Stock"];
  
  export default function StatusFilter({ selected, onChange }) {
    return (
      <Menu>
        <MenuButton as={Button} variant="outline">
          Status: {selected} ▼
        </MenuButton>
        <MenuList>
          {statuses.map((status) => (
            <MenuItem key={status} onClick={() => onChange(status)}>
              {status}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  }
  