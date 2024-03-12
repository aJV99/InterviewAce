'use client';
import { Content } from '@/components/ContentContainer';
import WithAuth from '@/redux/features/authHoc';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  Flex,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Box,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, ViewOffIcon } from '@chakra-ui/icons';
import InterviewModal from '@/components/InterviewModal';
import { fetchJobs, deleteInterview, startInterview, fetchInterview } from '@/redux/features/jobSlice';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { toCapitalCase } from '@/app/utils';
import Error from '@/app/error';
import useAnimatedRouter from '@/components/useAnimatedRouter';
import { StartInterviewDto } from '@/redux/dto/interview.dto';
import FeedbackCarousel from '@/components/FeedbackCarousel';

const JobPage = ({ params }: { params: { jobid: string; interviewid: string } }) => {
  const router = useAnimatedRouter();
  const {
    isOpen: isInterviewModalOpen,
    onOpen: onOpenInterviewModal,
    onClose: onCloseInterviewModal,
  } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const jobsState = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    // Check if the jobs are fetched or fetch if necessary
    if (!jobsState.fetched) {
      dispatch(fetchJobs());
    }

    dispatch(fetchInterview(params.interviewid));
  }, []);

  // dispatch(fetchInterview(params.interviewid));

  // Find the job in the state (this will be re-evaluated when the state changes)
  const job = jobsState.jobs.find((job) => job.id === params.jobid);
  const interview = job?.interviews.find((interview) => interview.id === params.interviewid);

  if (!job || !interview) {
    throw Error;
  }

  const handleStart = () => {
    const startInterviewDto: StartInterviewDto = {
      jobId: job.id,
      interviewId: interview.id,
    };
    dispatch(startInterview(startInterviewDto));
    router.push('/practice');
  };

  return (
    // <ErrorBoundary fallback={<Error />}>

    <Content>
      {/* <Bubble> */}
      <Flex p={5} borderRadius="xl" alignItems="center" justifyContent="space-between">
        <Heading size="3xl">Your Mock Interviews</Heading>
        <Button colorScheme="teal" onClick={handleStart}>
          Start your Mock Interview
        </Button>

        {/* The modal */}
        <Modal isOpen={isInterviewModalOpen} onClose={onCloseInterviewModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <InterviewModal
              onClose={onCloseInterviewModal}
              isEditing={true}
              existingInterview={interview}
              jobId={job.id}
            />
          </ModalContent>
        </Modal>
      </Flex>
      <Flex
        alignItems="stretch" // To ensure the Edit button can be centered across the full height
        justifyContent="space-between"
        p={5}
        mb={3}
        bg="white"
        boxShadow="md"
        borderRadius="xl"
      >
        {/* Left side: Role, Company, Location, and Job Description */}
        <Flex direction="column" flex="1">
          {/* Top Row: Role, Company, Location */}
          <Flex>
            <Box flex="1" textAlign="center">
              <Text fontWeight="bold">Interview Title: </Text>
              <Text fontSize="lg">{interview?.title}</Text>
            </Box>
            <Box flex="1" textAlign="center">
              <Text fontWeight="bold">Type of Interview: </Text>
              <Text fontSize="lg">
                {interview?.customType ? `Other - ${interview.customType}` : toCapitalCase(interview?.type || '')}
              </Text>
            </Box>
            <Box flex="1" textAlign="center">
              <Text fontWeight="bold">Overall Score: </Text>
              <Text fontSize="lg">
                {interview?.questions.length === interview.currentQuestion
                  ? `${interview?.overallScore}%`
                  : 'No attempt yet'}
              </Text>
            </Box>
          </Flex>
          {/* Bottom Row: Job Description */}
          <Box textAlign="center" mt={3}>
            <Text noOfLines={[1, 2, 3]}>
              <Text fontWeight="bold">Interview Context: </Text>
              {interview?.context}
            </Text>
          </Box>
        </Flex>

        {/* Right side: Edit Button */}
        <VStack alignItems="center" justifyContent="center" px={4} spacing={5}>
          <IconButton
            aria-label="Edit job"
            icon={<EditIcon />}
            onClick={onOpenInterviewModal}
            size="lg"
            colorScheme="blue"
            variant="outline"
          />
          <IconButton
            aria-label="Delete job"
            icon={<DeleteIcon />}
            onClick={onOpenDeleteModal}
            size="lg"
            colorScheme="red"
            variant="outline"
          />
        </VStack>
      </Flex>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        onDelete={() => {
          if (interview?.id) {
            // Check if job?.id is not undefined
            router.push('/job/' + job.id);
            dispatch(deleteInterview(interview.id));
          } else {
            console.error('Interview ID is undefined');
            // Optionally, handle the undefined ID case (e.g., showing an error message)
          }
        }}
        itemType={'interview'}
      />
      {/* <Suspense fallback={<Loading />}> */}
      <Box
        alignItems="stretch" // To ensure the Edit button can be centered across the full height
        justifyContent="space-between"
        p={5}
        mb={3}
        bg="white"
        boxShadow="md"
        borderRadius="xl"
      >
        <Heading size="xl">Your Feedback</Heading>
        {interview.currentQuestion === interview.questions.length ? (
          <Box my={3}>
            <FeedbackCarousel questions={interview.questions} />
          </Box>
        ) : (
          <Box textAlign="center" my={3}>
            <ViewOffIcon boxSize={16} />
            <Text px="60" py="5" fontSize="xl" fontWeight="bold">
              {`We can't show you the interview questions or any feedback until you've done your first attempt`}
            </Text>
          </Box>
        )}
      </Box>
      {/* </Suspense> */}
      {/* </Bubble> */}
    </Content>
    // </ErrorBoundary>
  );
};

export default WithAuth(JobPage);
