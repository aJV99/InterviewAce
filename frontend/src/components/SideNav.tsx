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
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FiHome, FiTrendingUp, FiFileText, FiSettings } from 'react-icons/fi';
import AnimatedLink from '@/components/AnimatedLink';
import CustomAvatar from '@/components/CustomAvatar';
import { FaBug, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import instance from '@/app/axios';
import { clearToken, reportBug } from '@/redux/features/authSlice';
import { resetJobs } from '@/redux/features/jobSlice';
import useAnimatedRouter from '@/components/useAnimatedRouter';
import { FaClipboardQuestion, FaInfo } from 'react-icons/fa6';
import { useCustomToast } from '@/components/Toast';
import { useState } from 'react';

interface LinkItemProps {
  name: string;
  icon: typeof FiHome;
  href: string;
  action?: () => void;
}

interface SideNavProps {
  children: React.ReactNode;
}

const SideNav: React.FC<SideNavProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useAnimatedRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const { showSuccess, showError } = useCustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bugTitle, setBugTitle] = useState<string>('');
  const [bugDescription, setBugDescription] = useState<string>('');

  const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome, href: '/dashboard' },
    { name: 'About Us', icon: FaInfo, href: '#' },
    { name: 'Resource Repository', icon: FiFileText, href: '#' },
    { name: 'Your Stats', icon: FiTrendingUp, href: '#' },
    { name: 'Settings', icon: FiSettings, href: '/settings' },
    {
      name: 'User Feedback Survey',
      icon: FaClipboardQuestion,
      href: 'https://forms.office.com/Pages/ResponsePage.aspx?id=kfCdVhOw40CG7r2cueJYFAT2LFQiryBJsYCPiA334lRUMUM5R09UUUVDOUNFRUxFWkFGUUw3WEYwTi4u',
    },
    { name: 'Report A Bug', icon: FaBug, href: '#', action: onOpen },
  ];

  const handleLogout = async () => {
    try {
      // Send request to logout the user on the server-side
      await instance.post('/auth/logout');
      dispatch(resetJobs()); // Reset jobs state
      dispatch(clearToken()); // Clear the token from Redux state
      setTimeout(() => {
        router.push('/login');
      }, 0);
    } catch (error) {
      showError('Logout Failed');
    }
  };

  const handleBugReport = async () => {
    try {
      if (auth.user?.email) {
        await reportBug(bugTitle, bugDescription, auth.user?.email);
        showSuccess('Bug report sent successfully.');
        onClose();
        setBugTitle('');
        setBugDescription('');
      }
    } catch (error) {
      showError('Bug report failed to send.');
    }
  };

  return (
    <ChakraProvider theme={extendTheme({ config: { useSystemColorMode: true, initialColorMode: 'light' } })}>
      <Flex height="100vh" overflowY="hidden">
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
            <NavItem key={link.name} icon={link.icon} href={link.href} action={link.action}>
              <Tooltip
                ml={1}
                placement="right"
                label={
                  link.href === '#' && !link.action
                    ? 'Coming Soon!'
                    : link.name === 'User Feedback Survey'
                      ? 'Participants get 3 months of free access to InterviewAce'
                      : ''
                }
              >
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

        <Box flex="1" overflowY="auto">
          {children}
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report a Bug</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!bugTitle}>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Brief description of the issue"
                value={bugTitle}
                onChange={(e) => setBugTitle(e.target.value)}
              />
              <FormErrorMessage>This field is required</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!bugDescription}>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Detailed description of the issue"
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
              />
              <FormErrorMessage>This field is required</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleBugReport} isDisabled={!bugTitle || !bugDescription}>
              Submit Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

interface NavItemProps {
  key: string; // Generally, 'key' is not defined in props as it's internal to React, but I'm including it here for clarity.
  icon: React.ElementType;
  href: string;
  children: React.ReactNode;
  action?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ key, icon, href, children, action }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (action) {
      e.preventDefault(); // Prevent default if there's a specific action
      action();
    }
  };

  return (
    <Link
      key={key}
      as={AnimatedLink}
      href={href}
      onClick={handleClick}
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
      target={icon === FaClipboardQuestion ? '_blank' : ''}
    >
      <Icon as={icon} mr="4" />
      {children}
    </Link>
  );
};

export default SideNav;
