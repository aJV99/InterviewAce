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
  Select,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { CreateInterviewDto, Interview, InterviewType } from '@/redux/dto/interview.dto';
import { toCapitalCase } from '@/app/utils';
import { updateInterview, addInterview } from '@/redux/features/jobSlice';
import { useCustomToast } from '@/components/Toast';

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

  const [interviewTitle, setInterviewTitle] = useState('');
  const [interviewType, setInterviewType] = useState(InterviewType.GENERAL);
  const [interviewCustomType, setInterviewCustomType] = useState('');
  const [interviewContext, setInterviewContext] = useState('');
  const { showSuccess, showError } = useCustomToast();

  // Set initial values for editing
  useEffect(() => {
    if (isEditing && existingInterview) {
      setInterviewTitle(existingInterview.title);
      setInterviewType(existingInterview.type);
      setInterviewCustomType(existingInterview.customType ?? '');
      setInterviewContext(existingInterview.context ?? '');
    }
  }, [isEditing, existingInterview]);

  const handleSubmit = async () => {
    const interviewData: CreateInterviewDto = {
      title: interviewTitle,
      type: interviewType,
      customType: interviewCustomType,
      context: interviewContext,
    };

    onClose();
    if (isEditing && existingInterview) {
      try {
        await dispatch(
          updateInterview({
            id: existingInterview.id,
            updateInterviewDto: interviewData,
          }),
        ).unwrap();
        showSuccess('Interview Updated Successfully');
      } catch (error) {
        showError('Interview Update Failed. Please try again later');
      }
    } else {
      try {
        await dispatch(addInterview({ jobId, createInterviewDto: interviewData })).unwrap();
        showSuccess('Interview Created Successfully');
      } catch (error) {
        showError('Interview Creation Failed. Please try again later');
      }
    }
  };

  return (
    <Stack>
      <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={10}>
        <Stack spacing={4}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            {isEditing ? 'Edit Interview' : 'Add a New Interview'}
          </Heading>
          <FormControl id="title" isRequired>
            <FormLabel>Interview Title</FormLabel>
            <Input
              placeholder="e.g.: Final Round, Supervisor Salary Call"
              type="text"
              value={interviewTitle}
              onChange={(e) => setInterviewTitle(e.target.value)}
            />
          </FormControl>
          <FormControl id="type" isRequired>
            <FormLabel>Interview Type</FormLabel>
            <Select value={interviewType} onChange={(e) => setInterviewType(e.target.value as InterviewType)}>
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
                placeholder="e.g.: Case Study Assessment, Knowledge Review"
                type="text"
                value={interviewCustomType}
                onChange={(e) => setInterviewCustomType(e.target.value)}
              />
            </FormControl>
          )}
          <FormControl id="context">
            <FormLabel>Interview Context</FormLabel>
            <Textarea
              placeholder="e.g.: In this interview, I'll be expected to..."
              value={interviewContext}
              onChange={(e) => setInterviewContext(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="blue" mt={2} onClick={handleSubmit}>
            {isEditing ? 'Update Interview' : 'Add New Interview'}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default InterviewModal;
