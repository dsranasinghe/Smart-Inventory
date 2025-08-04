import { Input } from "@chakra-ui/react";

export default function SearchFilter({ value, onChange }) {
  return (
    <Input
      placeholder="Search by name or supplier"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      width="250px"
    />
  );
}
