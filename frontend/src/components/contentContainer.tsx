import * as React from "react";
import { Box } from "@chakra-ui/react";

interface ContentContainerProps {
  children: React.ReactNode;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
  return (
    <Box padding="4" bgColor="#f7fafc" height="calc(100vh - 60px)">
      {React.Children.map(children, (child) => (
        <Box m={4}>{child}</Box>
      ))}
    </Box>
  );
};

export default ContentContainer;
