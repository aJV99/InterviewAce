import { ButtonGroup, Container, IconButton, Stack, Text, Image } from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export const Footer = () => {
  // Determine stack direction based on breakpoint

  return (
    <Container bg={'white'} as="footer" role="contentinfo" maxW="full" height="10vh" centerContent px={10} py={10}>
      <Stack
        direction="row"
        align="center"
        justify="center"
        width="full"
        height="full"
        spacing={4} // Adjust the spacing between logo and buttons or text
      >
        {/* Logo and Buttons Stack */}
        <Stack direction="row" align="center" justify="space-between" width="full">
          <Image src="/Logo.png" alt="InterviewAce Logo" w={300} minWidth={'200px'} />
          <Text fontSize="sm" color="gray.600" textAlign="center" width="full">
            &copy; {new Date().getFullYear()} InterviewAce. All rights reserved.
          </Text>
          <ButtonGroup variant="ghost" size="lg" isAttached>
            <IconButton as="a" href="#" aria-label="LinkedIn" icon={<FaLinkedin fontSize="24px" />} />
            <IconButton as="a" href="#" aria-label="GitHub" icon={<FaGithub fontSize="24px" />} />
            <IconButton as="a" href="#" aria-label="Twitter" icon={<FaTwitter fontSize="24px" />} />
          </ButtonGroup>
        </Stack>
      </Stack>
    </Container>
  );
};
