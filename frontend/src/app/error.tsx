"use client";
import AnimatedButton from "@/components/AnimatedButton";
import { Box, Center, Heading, Text, Image } from "@chakra-ui/react";

const ErrorNotFound = () => {
  return (
    <Center height="100vh" flexDirection="column" bg="gray.100">
      <Box py={10} px={6} textAlign="center">
        {" "}
        <Image src="/Logo.png" alt="InterviewAce Logo" width="30%" margin="auto" display="block" />
        <Heading
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
          marginTop="4"
        >
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Page Not Found
        </Text>
        <Text color={"gray.500"} mb={6}>
          {`The page you're looking for does not seem to exist`}
        </Text>
        <AnimatedButton
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
          marginTop="4"
          destination="/dashboard"
        >
          Go to Home
        </AnimatedButton>
      </Box>
    </Center>
  );
};

export default ErrorNotFound;
