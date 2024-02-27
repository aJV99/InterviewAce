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
} from "@chakra-ui/react";
import { PasswordField } from "@/components/passwordField";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login, loginSuccess } from "@/redux/features/authSlice";
import withAuth from "@/redux/features/authHoc";
import AnimatedLink from "@/components/AnimatedLink";
import useAnimatedRouter from "@/components/useAnimatedRouter";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useAnimatedRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      // Check if email or password is empty
      setError("Both email and password are required fields.");
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
      router.animatedRoute("/dashboard");
    } catch (error: any) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.statusCode &&
        error.response.data.statusCode === 401
      ) {
        setError("Incorrect email or password.");
      } else {
        setError("An error occurred.");
      }
    }
  };

  return (
    <Container maxW="lg" py={{ base: "12", md: "24" }} px={{ base: "0", sm: "8" }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Image src="/Logo.png" alt="InterviewAce Logo" w={350} minWidth={"200px"} alignSelf={"center"} />
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading fontWeight={600} fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }}>
              Log in to your account
            </Heading>
            <Text color="fg.muted">
              Don&apos;t have an account?{" "}
              <Link color={"blue.400"} as={AnimatedLink} href={"/signup"}>
                Sign up
              </Link>
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
              <FormControl isRequired>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  isRequired={true}
                />
              </FormControl>
              <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} isRequired={true} />
            </Stack>
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button variant="text" size="sm">
                Forgot password?
              </Button>
            </HStack>
            <Stack spacing="6">
              <Button onClick={handleLogin}>Sign in</Button>
              <HStack>
                <Divider />
                <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                  or continue with
                </Text>
                <Divider />
              </HStack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default withAuth(Login);
