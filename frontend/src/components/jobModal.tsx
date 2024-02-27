import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Job } from "@/redux/dto/job.dto";
import { editJob, createJob } from "@/redux/features/jobSlice";

interface JobModalProps {
  onClose: () => void;
  isEditing?: boolean;
  existingJob?: Job;
}

export default function JobModal({ onClose, isEditing = false, existingJob }: JobModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobLocation, setJobLocation] = useState("");

  // Set initial values for editing
  useEffect(() => {
    if (isEditing && existingJob) {
      setJobTitle(existingJob.title);
      setCompanyName(existingJob.company);
      setJobDescription(existingJob.description);
      setJobLocation(existingJob.location ?? "");
    }
  }, [isEditing, existingJob]);

  const handleSubmit = async () => {
    const jobData = {
      title: jobTitle,
      company: companyName,
      description: jobDescription,
      location: jobLocation,
    };

    try {
      onClose();
      if (isEditing && existingJob) {
        await dispatch(editJob({ id: existingJob.id, updateJobDto: jobData })).unwrap();
      } else {
        await dispatch(createJob(jobData)).unwrap();
      }
    } catch (error) {
      console.error("Failed to process the job: ", error);
    }
  };

  return (
    <Stack>
      <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={10}>
        <Stack spacing={4}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Add a new job
          </Heading>
          <FormControl id="title" isRequired>
            <FormLabel>What&apos;s the job title of the role you are applying to?</FormLabel>
            <Input
              type="text"
              placeholder="e.g.: Technology Consultant, Accountant"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </FormControl>
          <FormControl id="company" isRequired>
            <FormLabel>What&apos;s the name of the company you are applying to?</FormLabel>
            <Input
              type="text"
              placeholder="e.g.: IBM, Goldman Sachs"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </FormControl>
          <FormControl id="description" isRequired>
            <FormLabel>What&apos;s the job description for the role you are applying to?</FormLabel>
            <Textarea
              placeholder="e.g.: In this role, I'm required to..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </FormControl>
          <FormControl id="location" isRequired>
            <FormLabel>What&apos;s the location of the company you are applying to?</FormLabel>
            <Input
              type="text"
              placeholder="e.g.: London, UK / Mombasa, Kenya / Remote"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="blue" mt={2} mx={"30%"} onClick={handleSubmit}>
            {isEditing ? "Update Job Info" : "Add New Job"}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
