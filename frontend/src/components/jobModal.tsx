import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function JobModal() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack>
      <Box
        // w={'50vw'}
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={10}
      >
        <Stack spacing={4}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Add a new job
          </Heading>
          <FormControl id="title" isRequired>
            <FormLabel>
              What&apos;s the job title of the role you are applying to?
            </FormLabel>
            <Input
              type="text"
              placeholder="e.g.: Technology Consultant, Accountant"
            />
          </FormControl>
          <FormControl id="company" isRequired>
            <FormLabel>
              What&apos;s the name of the company you are applying to?
            </FormLabel>
            <Input type="text" placeholder="e.g.: IBM, Goldman Sachs" />
          </FormControl>
          <FormControl id="description" isRequired>
            <FormLabel>
              What&apos;s the job description for the role you are applying to?
            </FormLabel>
            <Textarea placeholder="e.g.: In this role, I'm required to..." />
          </FormControl>
          <FormControl id="location" isRequired>
            <FormLabel>
              What&apos;s the location of the company you are applying to?
            </FormLabel>
            <Input
              type="text"
              placeholder="e.g.: London, UK / Mombasa, Kenya / Remote"
            />
          </FormControl>
          <Button colorScheme="blue" mt={2} mx={"30%"}>
            Save
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
