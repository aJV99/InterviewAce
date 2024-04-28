import {
  Box,
  Button,
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
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  FormErrorMessage,
  List,
  ListItem,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, loginSuccess, signup } from '@/redux/features/authSlice';
import { AxiosError } from 'axios';
import { CheckIcon, CloseIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import AnimatedLink from '@/components/AnimatedLink';
import useAnimatedRouter from '@/components/useAnimatedRouter';

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [hasValidLength, setHasValidLength] = useState(false);

  const dispatch = useDispatch();
  const router = useAnimatedRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    setHasLowercase(/[a-z]/.test(password));
    setHasUppercase(/[A-Z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSymbol(/[^A-Za-z0-9]/.test(password));
    setHasValidLength(password.length >= 8);
  };

  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    };

    setHasLowercase(validations.lowercase);
    setHasUppercase(validations.uppercase);
    setHasNumber(validations.number);
    setHasSymbol(validations.symbol);
    setHasValidLength(validations.length);

    const allValid = Object.values(validations).every(Boolean);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      password: allValid ? '' : 'Invalid password',
    }));

    return allValid;
  };

  const handleValidation = (field: string, value: string) => {
    let errorMsg = '';
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value) errorMsg = 'This field is required.';
        break;
      case 'email':
        if (!validateEmail(value)) errorMsg = 'Invalid email address.';
        break;
      case 'password':
        if (!validatePassword(value)) errorMsg = 'Invalid password';
        break;
    }
    setValidationErrors({ ...validationErrors, [field]: errorMsg });
    return errorMsg === '';
  };

  const handleSignup = async () => {
    // Validate all fields before attempting to sign up
    const validFirstName = handleValidation('firstName', firstName);
    const validLastName = handleValidation('lastName', lastName);
    const validEmail = handleValidation('email', email);
    const validPassword = handleValidation('password', password);

    if (!validFirstName || !validLastName || !validEmail || !validPassword) {
      setError('Please correct the highlighted errors before submitting.');
      return;
    }

    try {
      await signup(firstName, lastName, email, password);
      const data = await login(email, password);
      dispatch(
        loginSuccess({
          firstName: data.firstName,
          lastName: data.lastName,
          accessToken: data.accessToken,
        }),
      );
      router.animatedRoute('/dashboard');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.statusCode === 401) {
        setError('Incorrect email or password.');
      } else {
        setError('An error occurred.');
      }
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Image src="/Logo.png" alt="InterviewAce Logo" w={350} minWidth={'200px'} alignSelf={'center'} />
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading fontWeight={600} fontSize={{ base: 'lg', sm: 'xl', md: '2xl', lg: '3xl' }}>
              Sign up for an account
            </Heading>
            <Text color="fg.muted">
              Already have an account?{' '}
              <Link color={'blue.400'} as={AnimatedLink} href={'/login'}>
                Login
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
              <HStack align="start">
                <Box flex="1">
                  <FormControl id="firstName" isRequired isInvalid={!!validationErrors.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => handleValidation('firstName', firstName)}
                    />
                    <FormErrorMessage>{validationErrors.firstName}</FormErrorMessage>
                  </FormControl>
                </Box>
                <Box flex="1">
                  <FormControl id="lastName" isRequired isInvalid={!!validationErrors.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={() => handleValidation('lastName', lastName)}
                    />
                    <FormErrorMessage>{validationErrors.lastName}</FormErrorMessage>
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired isInvalid={!!validationErrors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleValidation('email', email)}
                />
                {validationErrors.email && <FormErrorMessage>{validationErrors.email}</FormErrorMessage>}
              </FormControl>
              <FormControl id="password" isRequired isInvalid={!!validationErrors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={() => handleValidation('password', password)}
                  />
                  <InputRightElement h={'full'}>
                    <Button variant={'ghost'} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {validationErrors.password && (
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
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              <Stack spacing="6">
                <Button
                  isDisabled={
                    !firstName ||
                    !lastName ||
                    !email ||
                    !password ||
                    !!validationErrors.firstName ||
                    !!validationErrors.lastName ||
                    !!validationErrors.email ||
                    !!validationErrors.password ||
                    !hasLowercase ||
                    !hasUppercase ||
                    !hasNumber ||
                    !hasSymbol ||
                    !hasValidLength
                  }
                  onClick={handleSignup}
                >
                  Sign up
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
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default SignUpPage;
