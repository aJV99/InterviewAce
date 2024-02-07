// "use client";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
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
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
// import { OAuthButtonGroup } from './OAuthButtonGroup'
import { PasswordField } from "@/components/passwordField";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login, signup } from "@/redux/api";
import { loginSuccess } from "@/redux/features/authSlice";
import withAuth from "@/redux/features/authHoc";
import { AxiosError } from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const SignUpPage = () => {
  // Added state for firstName and lastName
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both email and password are required fields.");
      return;
    }

    try {
      // Updated to use state values for firstName and lastName
      await signup(firstName, lastName, email, password);
      const data = await login(email, password);
      dispatch(loginSuccess({
        firstName: data.firstName,
        lastName: data.lastName,
        accessToken: data.accessToken,
      }));
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.response?.data.statusCode === 401) {
        setError("Incorrect email or password.");
      } else {
        setError("An error occurred.");
      }
    }
  };

  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Image
            src="Logo.png"
            alt="InterviewAce Logo"
            w={350}
            minWidth={"200px"}
            alignSelf={"center"}
          />
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading
              fontWeight={600}
              fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }}
            >
              Sign up for your account
            </Heading>
            <Text color="fg.muted">
              Already a user? <Link color={"blue.400"} href="/login">Login</Link>
            </Text>
          </Stack>
        </Stack>
        <Box
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg={{ base: "transparent", sm: "bg.surface" }}
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "xl" }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
            <HStack>
            <Box>
              <FormControl id="firstName" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </FormControl>
            </Box>
            <Box>
              <FormControl id="lastName" isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </FormControl>
            </Box>
          </HStack>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
              <InputRightElement h={"full"}>
                <Button variant={"ghost"} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing="6">
            <Button onClick={handleLogin}>Sign up</Button>
              <HStack>
                <Divider />
                <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                  or continue with
                </Text>
                <Divider />
              </HStack>
              {/* <OAuthButtonGroup /> */}
            </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default SignUpPage;
