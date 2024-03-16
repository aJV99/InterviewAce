import * as React from 'react';
import {
  ChakraProvider,
  Flex,
  Box,
  VStack,
  Link,
  Text,
  Icon,
  extendTheme,
  Image,
  IconButton,
  Spacer,
  Tooltip,
} from '@chakra-ui/react';
import { FiHome, FiTrendingUp, FiFileText, FiSettings } from 'react-icons/fi';
import AnimatedLink from '@/components/AnimatedLink';
import CustomAvatar from '@/components/CustomAvatar';
import { FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import instance from '@/app/axios';
import { clearToken } from '@/redux/features/authSlice';
import { resetJobs } from '@/redux/features/jobSlice';
import useAnimatedRouter from '@/components/useAnimatedRouter';
import { FaInfo } from 'react-icons/fa6';
import { useCustomToast } from '@/components/Toast';

// Define the link items for the side navigation
interface LinkItemProps {
  name: string;
  icon: typeof FiHome;
  href: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/dashboard' },
  { name: 'About Us', icon: FaInfo, href: '#' },
  { name: 'Resource Repository', icon: FiFileText, href: '#' },
  { name: 'Your Stats', icon: FiTrendingUp, href: '#' },
  { name: 'Settings', icon: FiSettings, href: '/settings' },

  // { name: 'History', icon: FiClock, href: '/dashboard' },
  // { name: 'Favorites', icon: FiStar, href: '/dashboard' },
];

interface SideNavProps {
  children: React.ReactNode;
}

const SideNav: React.FC<SideNavProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useAnimatedRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const { showError } = useCustomToast();

  const handleLogout = async () => {
    try {
      // Send request to logout the user on the server-side
      await instance.post('/auth/logout');
      // Clear the token from Redux state
      dispatch(resetJobs()); // Reset jobs state
      dispatch(clearToken());
      setTimeout(() => {
        router.push('/login');
      }, 0);
    } catch (error) {
      showError('Logout Failed');
      // Handle the error as required, e.g., show a notification to the user
    }
  };

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
            <NavItem key={link.name} icon={link.icon} href={link.href}>
              <Tooltip key={link.name} label={link.href === '#' && 'Coming Soon!'}>
                {link.name}
              </Tooltip>
            </NavItem>
          ))}
          <Box flexGrow={1} />
          <Flex alignItems="center" width="full">
            <CustomAvatar size="md" name={auth.firstName + ' ' + auth.lastName} mr={2.5} />
            <Text>{auth.firstName + ' ' + auth.lastName}</Text>
            <Spacer />
            <Tooltip label="Logout">
              <IconButton
                aria-label="Logout"
                color="white"
                icon={<FaSignOutAlt />}
                size="lg"
                borderRadius="xl"
                onClick={handleLogout}
                backgroundColor="transparent"
                variant="ghost"
                _hover={{
                  bg: 'blue.700',
                }}
              />
            </Tooltip>
          </Flex>
        </VStack>

        {/* Main Content */}
        <Box flex="1" overflowY="auto">
          {children}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

const NavItem = ({ icon, href, children }: { icon: typeof FiHome; href: string; children: React.ReactNode }) => {
  return (
    <Link
      as={AnimatedLink}
      href={href}
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
