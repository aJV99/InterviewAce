import * as React from "react";
import { Box } from "@chakra-ui/react";

interface BubbleProps {
  children: React.ReactNode;
}

const Bubble: React.FC<BubbleProps> = ({ children }) => {
  return (
    <Box bg={"#f7fafc"} p={5} m={1} boxShadow="md" borderRadius="xl">
      {children}
    </Box>
  );
};

export default Bubble;
