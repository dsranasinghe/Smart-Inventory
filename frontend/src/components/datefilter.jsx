import { HStack, Input, IconButton } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

export default function DateFilter({ date, onChange }) {
  return (
    <HStack>
      <IconButton icon={<CalendarIcon />} aria-label="Date Filter" />
      <Input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
      />
    </HStack>
  );
}
