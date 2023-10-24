import * as React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";

const Header: React.FC = () => {
  return (
    <Box
      bg="white"
      p={5}
      boxShadow="md"
      borderRadius="xl"
      // margin={2}
      // display="flex"
      // flexDirection="column"
      // width="100%"
      // alignItems="center"
    >
      <Heading size="3xl">Your Jobs</Heading>
    </Box>
  );
};

export default Header;
