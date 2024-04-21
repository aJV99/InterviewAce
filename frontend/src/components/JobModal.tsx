'use client';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
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
  FormErrorMessage,
} from '@chakra-ui/react';
import { Job } from '@/redux/dto/job.dto';
import { editJob, createJob } from '@/redux/features/jobSlice';
import { useCustomToast } from '@/components/Toast';
import { ErrorDto } from '@/app/error';

interface JobModalProps {
  onClose: () => void;
  isEditing?: boolean;
  existingJob?: Job;
}

export default function JobModal({ onClose, isEditing = false, existingJob }: JobModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useCustomToast();
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    company: '',
    description: '',
  });

  // Set initial values for editing
  useEffect(() => {
    if (isEditing && existingJob) {
      setJobTitle(existingJob.title);
      setCompanyName(existingJob.company);
      setJobDescription(existingJob.description);
      setJobLocation(existingJob.location ?? '');
    }
  }, [isEditing, existingJob]);

  const handleSubmit = async () => {
    // Validate all fields before attempting to submit
    const isTitleValid = validateTitle();
    const isCompanyValid = validateCompany();
    const isDescriptionValid = validateDescription();

    // Check if there are any validation errors
    if (!isTitleValid || !isCompanyValid || !isDescriptionValid) {
      return; // Prevent submission if any validations fail
    }

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
        showSuccess('Job Updated Successfully');
      } else {
        await dispatch(createJob(jobData)).unwrap();
        showSuccess('Job Created Successfully');
      }
    } catch (error: unknown) {
      const typedError = error as ErrorDto;
      const errorMessage = typedError.response.data.message
        ? 'Job creation failed. Reasoning: ' + typedError.response.data.message
        : 'Please try again later.';
      showError('An error occurred.', errorMessage);
    }
  };

  const validateTitle = () => {
    if (!jobTitle.trim()) {
      setValidationErrors((errors) => ({ ...errors, title: 'Job title is required.' }));
      return false;
    }
    setValidationErrors((errors) => ({ ...errors, title: '' }));
    return true;
  };

  const validateCompany = () => {
    if (!companyName.trim()) {
      setValidationErrors((errors) => ({ ...errors, company: 'Company name is required.' }));
      return false;
    }
    setValidationErrors((errors) => ({ ...errors, company: '' }));
    return true;
  };

  const validateDescription = () => {
    if (!jobDescription.trim()) {
      setValidationErrors((errors) => ({ ...errors, description: 'Job description is required.' }));
      return false;
    }
    setValidationErrors((errors) => ({ ...errors, description: '' }));
    return true;
  };

  return (
    <Stack>
      <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={10}>
        <Stack spacing={4}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Add a new job
          </Heading>
          <FormControl id="title" isRequired isInvalid={!!validationErrors.title}>
            <FormLabel>What&apos;s the job title of the role you are applying to?</FormLabel>
            <Input
              type="text"
              placeholder="e.g.: Technology Consultant, Accountant"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              onBlur={validateTitle}
            />
            {validationErrors.title && <FormErrorMessage>{validationErrors.title}</FormErrorMessage>}
          </FormControl>

          <FormControl id="company" isRequired isInvalid={!!validationErrors.company}>
            <FormLabel>What&apos;s the name of the company you are applying to?</FormLabel>
            <Input
              type="text"
              placeholder="e.g.: IBM, Goldman Sachs"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onBlur={validateCompany}
            />
            {validationErrors.company && <FormErrorMessage>{validationErrors.company}</FormErrorMessage>}
          </FormControl>

          <FormControl id="description" isRequired isInvalid={!!validationErrors.description}>
            <FormLabel>What&apos;s the job description for the role you are applying to?</FormLabel>
            <Textarea
              placeholder="e.g.: In this role, I'm required to..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              onBlur={validateDescription}
            />
            {validationErrors.description && <FormErrorMessage>{validationErrors.description}</FormErrorMessage>}
          </FormControl>

          <FormControl id="location">
            <FormLabel>What&apos;s the location of the company you are applying to?</FormLabel>
            <Input
              type="text"
              placeholder="e.g.: London, UK / Mombasa, Kenya / Remote"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="blue" mt={2} mx={'30%'} onClick={handleSubmit}>
            {isEditing ? 'Update Job Info' : 'Add New Job'}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
