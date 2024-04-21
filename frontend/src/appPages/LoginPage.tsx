import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  Image,
  Alert,
  AlertIcon,
  InputRightElement,
  FormErrorMessage,
  InputGroup,
  useDisclosure,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  List,
  ListItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgot, login, loginSuccess, reset } from '@/redux/features/authSlice';
import AnimatedLink from '@/components/AnimatedLink';
import useAnimatedRouter from '@/components/useAnimatedRouter';
import { CheckIcon, CloseIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { ErrorDto } from '@/app/error';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    modalEmail: '',
    newPassword: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [hasValidLength, setHasValidLength] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const router = useAnimatedRouter();

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
    } else if (timeLeft) {
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timeLeft]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleValidation = (field: string, value: string) => {
    let errorMsg = '';
    if (field === 'email' && !validateEmail(value)) {
      errorMsg = 'Invalid email address.';
    } else if (!value) {
      errorMsg = 'This field is required.';
    }
    setValidationErrors({ ...validationErrors, [field]: errorMsg });
    return errorMsg === '';
  };

  const handleLogin = async () => {
    const validEmail = handleValidation('email', email);
    const validPassword = handleValidation('password', password);

    if (!validEmail || !validPassword) {
      setError('Please correct the highlighted errors before submitting.');
      return;
    }

    try {
      const data = await login(email, password);
      dispatch(
        loginSuccess({
          firstName: data.firstName,
          lastName: data.lastName,
          accessToken: data.accessToken,
        }),
      );
      router.animatedRoute('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.statusCode &&
        error.response.data.statusCode === 401
      ) {
        setError('Incorrect email or password.');
      } else {
        setError('An error occurred.');
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      await forgot(resetEmail);
      setTimeLeft(60); // 60 seconds before they can resend the token
      toast({
        title: 'Check your email',
        description: "If an account with that email exists, we've sent a password reset token.",
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reset token.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      toast({
        title: 'Invalid Password',
        description: 'Please ensure the password meets all requirements.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await reset(resetEmail, resetToken, newPassword);
      onClose();
      toast({
        title: 'Password Changed Successfully',
        description: 'You can now log in with your new password.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const typedError = error as ErrorDto;
      toast({
        title: 'Error',
        description: typedError.response?.data?.message || 'Failed to reset password.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    setHasLowercase(/[a-z]/.test(password));
    setHasUppercase(/[A-Z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSymbol(/[^A-Za-z0-9]/.test(password));
    setHasValidLength(password.length >= 8);
  };

  const validatePassword = () => {
    const isValid = hasLowercase && hasUppercase && hasNumber && hasSymbol && hasValidLength;
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      password: isValid ? '' : 'Invalid password',
    }));
    return isValid;
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Image src="/Logo.png" alt="InterviewAce Logo" w={350} minWidth={'200px'} alignSelf={'center'} />
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading fontWeight={600} fontSize={{ base: 'lg', sm: 'xl', md: '2xl', lg: '3xl' }}>
              Log in to your account
            </Heading>
            <Text color="fg.muted">
              Don&apos;t have an account?{' '}
              <Link color={'blue.400'} as={AnimatedLink} href={'/signup'}>
                Sign up
              </Link>
            </Text>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg.surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl isRequired isInvalid={!!validationErrors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleValidation('email', email)}
                  required
                />
                <FormErrorMessage>{validationErrors.email}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isRequired isInvalid={!!validationErrors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleValidation('password', password)}
                  />
                  <InputRightElement h={'full'}>
                    <Button variant={'ghost'} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{validationErrors.password}</FormErrorMessage>
              </FormControl>
            </Stack>
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button variant="text" size="sm" onClick={onOpen}>
                Forgot password?
              </Button>
            </HStack>
            <Stack spacing="6">
              <Button isDisabled={!email || !password} onClick={handleLogin}>
                Sign in
              </Button>
              {/* <HStack>
                <Divider />
                <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                  or continue with
                </Text>
                <Divider />
              </HStack> */}
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!validationErrors.modalEmail}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email2"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                onBlur={() => handleValidation('email', email)}
                required
                placeholder="Enter your email"
              />
              <FormErrorMessage>{validationErrors.modalEmail}</FormErrorMessage>
            </FormControl>
            {timeLeft === null ? (
              <Button mt={4} onClick={handleForgotPassword}>
                Send Reset Token
              </Button>
            ) : (
              <Text mt={4}>Resend available in {timeLeft} seconds</Text>
            )}
            <FormControl mt={4}>
              <FormLabel>Reset Token</FormLabel>
              <Input
                placeholder="Enter reset token"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                maxLength={8}
              />
            </FormControl>
            <FormControl mt={4} isInvalid={!!validationErrors.newPassword}>
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={validatePassword}
                />
                <InputRightElement h="full">
                  <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {validationErrors.newPassword && (
                <FormErrorMessage>
                  <List spacing={1}>
                    <ListItem color={hasValidLength ? 'green.500' : 'red.500'}>
                      {hasValidLength ? <CheckIcon /> : <CloseIcon />} 8 or more characters
                    </ListItem>
                    <ListItem color={hasLowercase ? 'green.500' : 'red.500'}>
                      {hasLowercase ? <CheckIcon /> : <CloseIcon />} Lowercase letter (a-z)
                    </ListItem>
                    <ListItem color={hasUppercase ? 'green.500' : 'red.500'}>
                      {hasUppercase ? <CheckIcon /> : <CloseIcon />} Uppercase letter (A-Z)
                    </ListItem>
                    <ListItem color={hasNumber ? 'green.500' : 'red.500'}>
                      {hasNumber ? <CheckIcon /> : <CloseIcon />} A number (0-9)
                    </ListItem>
                    <ListItem color={hasSymbol ? 'green.500' : 'red.500'}>
                      {hasSymbol ? <CheckIcon /> : <CloseIcon />} A symbol (!@#$...)
                    </ListItem>
                  </List>
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleResetPassword}>
              Reset Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Login;
