'use client';
import { useEffect, useState } from 'react';
import { Box, Center, Heading, Text, Image, Button } from '@chakra-ui/react';
import useAnimatedRouter from '@/components/useAnimatedRouter';

const MobileAccessBlocker = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useAnimatedRouter();

  useEffect(() => {
    const checkIfMobile = () => {
      const match = window.matchMedia('(max-width: 932px)').matches;
      setIsMobile(match);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!isMobile) {
    return children;
  }

  return (
    <Center height="100vh" flexDirection="column" bg="gray.100">
      <Box py={10} px={6} textAlign="center">
        <Image src="/Logo.png" alt="Logo" width="50%" margin="auto" display="block" />
        <Heading
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
          marginTop="4"
        >
          Mobile Access Restricted
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Oops! This application is not currently available on Mobile
        </Text>
        <Text color={'gray.500'} mb={6}>
          {`We're sorry, but our application is not accessible on mobile devices. If you would like to use InterviewAce, please visit the site on a Desktop computer using Google Chrome or Microsoft Edge.`}
        </Text>
        <Button
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
          marginTop="4"
          onClick={() => router.push('/')}
        >
          Go to Home
        </Button>
      </Box>
    </Center>
  );
};

export default MobileAccessBlocker;
