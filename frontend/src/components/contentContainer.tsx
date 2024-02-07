import * as React from "react";
import { Box } from "@chakra-ui/react";

interface ContentContainerProps {
  children: React.ReactNode;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
  return (
    <Box
      padding="0"
      bgColor="#d3deed"
      minHeight={{ base: "100vh", md: "calc(100vh - 60px)" }} // Set minimum height
      height="auto"
    >
      {React.Children.map(children, (child) => (
        <Box>{child}</Box>
      ))}
    </Box>
  );
};

export const Content: React.FC<ContentContainerProps> = ({ children }) => {
  return (
    <>
      {React.Children.map(children, (child) => (
        <Box mb={3}>{child}</Box>
      ))}
    </>
  );
};

export default ContentContainer;
