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
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { addInterview, createJob, editJob, updateInterview } from "@/redux/api";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "@/redux/store";
import { Interview, InterviewType } from "@/redux/dto/interview.dto";
import { toCapitalCase } from "@/app/utils";

interface InterviewModalProps {
  onClose: () => void;
  isEditing?: boolean;
  existingInterview?: Interview;
  jobId: string; // Adding jobId as a required prop
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  onClose,
  isEditing = false,
  existingInterview,
  jobId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [interviewTitle, setInterviewTitle] = useState("");
  const [interviewType, setInterviewType] = useState(InterviewType.GENERAL);
  const [interviewCustomType, setInterviewCustomType] = useState("");
  const [interviewContext, setInterviewContext] = useState("");

  // Set initial values for editing
  useEffect(() => {
    if (isEditing && existingInterview) {
      setInterviewTitle(existingInterview.title);
      setInterviewType(existingInterview.type);
      setInterviewCustomType(existingInterview.customType ?? "");
      setInterviewContext(existingInterview.context ?? "");
    }
  }, [isEditing, existingInterview]);

  const handleSubmit = async () => {
    const interviewData = {
      jobId: jobId, // Adding jobId to the interview data
      title: interviewTitle,
      type: interviewType,
      customType: interviewCustomType,
      context: interviewContext,
    };

    try {
      if (isEditing && existingInterview) {
        await dispatch(updateInterview({ id: existingInterview.id, updateInterviewDto: interviewData })).unwrap();
      } else {
        await dispatch(addInterview(interviewData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to process the interview: ", error);
    }
  };

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
            {isEditing ? "Edit Interview" : "Add a New Interview"}
          </Heading>
          <FormControl id="title" isRequired>
            <FormLabel>Interview Title</FormLabel>
            <Input
              type="text"
              value={interviewTitle}
              onChange={(e) => setInterviewTitle(e.target.value)}
            />
          </FormControl>
          <FormControl id="type" isRequired>
            <FormLabel>Interview Type</FormLabel>
            <Select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value as InterviewType)}
            >
              {/* Map over InterviewType enum to create options */}
              {Object.values(InterviewType).map((type) => (
                <option key={type} value={type}>
                  {toCapitalCase(type)}
                </option>
              ))}
            </Select>
          </FormControl>
          {interviewType === InterviewType.CUSTOM && (
            <FormControl id="customType" isRequired>
              <FormLabel>Custom Interview Type</FormLabel>
              <Input
                type="text"
                value={interviewCustomType}
                onChange={(e) => setInterviewCustomType(e.target.value)}
              />
            </FormControl>
          )}
          <FormControl id="context">
            <FormLabel>Interview Context</FormLabel>
            <Input
              type="text"
              value={interviewContext}
              onChange={(e) => setInterviewContext(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="blue" mt={2} onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

export default InterviewModal;