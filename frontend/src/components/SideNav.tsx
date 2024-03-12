import * as React from 'react';
import { ChakraProvider, Flex, Box, VStack, Link, Text, Avatar, Icon, extendTheme, Image } from '@chakra-ui/react';
import { FiHome, FiTrendingUp, FiFileText, FiClock, FiStar, FiSettings } from 'react-icons/fi';
import AnimatedLink from './AnimatedLink';

// Define the link items for the side navigation
interface LinkItemProps {
  name: string;
  icon: typeof FiHome;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome },
  { name: 'Analysis', icon: FiTrendingUp },
  { name: 'Documents', icon: FiFileText },
  { name: 'History', icon: FiClock },
  { name: 'Favorites', icon: FiStar },
  { name: 'Settings', icon: FiSettings },
];

interface SideNavProps {
  children: React.ReactNode;
}

const SideNav: React.FC<SideNavProps> = ({ children }) => {
  return (
    <ChakraProvider theme={extendTheme({ config: { useSystemColorMode: true, initialColorMode: 'light' } })}>
      <Flex height="100vh" overflowY="hidden">
        {/* Sidebar */}
        <VStack
          w="280px"
          flexShrink={0}
          p="5"
          backgroundColor="#226aaf"
          color="white"
          alignItems="flex-start"
          spacing={4}
        >
          <Image
            src="/Logo-white.png"
            alt="InterviewAce Logo"
            w="full"
            minWidth={'200px'}
            mb={5}
            mt={2}
            align={'left'}
          />

          {LinkItems.map((link) => (
            <NavItem key={link.name} icon={link.icon}>
              {link.name}
            </NavItem>
          ))}
          <Box flexGrow={1} />
          <Box>
            <Avatar size="sm" name="John Doe" />
            <Text mt="2">John Doe</Text>
            <Text fontSize="sm">john@chakra-ui.com</Text>
          </Box>
        </VStack>

        {/* Main Content */}
        <Box flex="1" overflowY="auto">
          {children}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

const NavItem = ({ icon, children }: { icon: typeof FiHome; children: React.ReactNode }) => {
  return (
    <Link
      as={AnimatedLink}
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      w="full"
      display="flex"
      alignItems="center"
      p="2"
      borderRadius="md"
      _hover={{
        bg: 'blue.700',
        color: 'white',
      }}
    >
      <Icon as={icon} mr="4" />
      {children}
    </Link>
  );
};

export default SideNav;
