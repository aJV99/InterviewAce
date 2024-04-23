'use client';
import { Content } from '@/components/ContentContainer';
import WithAuth from '@/redux/features/authHoc';
import { useEffect, useState } from 'react';
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
  Tooltip,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, ViewOffIcon } from '@chakra-ui/icons';
import InterviewModal from '@/components/InterviewModal';
import {
  fetchJobs,
  deleteInterview,
  startInterview,
  fetchInterview,
  retakeInterview,
} from '@/redux/features/jobSlice';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { getColorByScore, toCapitalCase } from '@/app/utils';
import Error from '@/app/error';
import useAnimatedRouter from '@/components/useAnimatedRouter';
import { StartInterviewDto } from '@/redux/dto/interview.dto';
import FeedbackCarousel from '@/components/FeedbackCarousel';
import RetakeInterviewModal from '@/components/RetakeInterviewModal';
import { useCustomToast } from '@/components/Toast';
import { FiRefreshCw } from 'react-icons/fi';

const JobPage = ({ params }: { params: { jobid: string; interviewid: string } }) => {
  const router = useAnimatedRouter();
  const {
    isOpen: isInterviewModalOpen,
    onOpen: onOpenInterviewModal,
    onClose: onCloseInterviewModal,
  } = useDisclosure();
  const { showSuccess, showError } = useCustomToast();
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
  const { isOpen: isRetakeModalOpen, onOpen: onOpenRetakeModal, onClose: onCloseRetakeModal } = useDisclosure();
  const [loaded, setLoaded] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const jobsState = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    if (!jobsState.fetched) {
      try {
        dispatch(fetchJobs()).unwrap();
      } catch (error) {
        showError('Server Error. Please try again later');
      }
    }

    if (!loaded) {
      try {
        dispatch(fetchInterview(params.interviewid)).unwrap();
        setLoaded(true);
      } catch (error) {
        showError('Server Error. Please try again later');
      }
    }
  }, [loaded, dispatch, params.interviewid, showError, jobsState.fetched]);

  const job = jobsState.jobs[params.jobid];
  const interview = job?.interviews[params.interviewid];

  if (!job || !interview) {
    throw Error;
  }

  const handleStart = () => {
    const startInterviewDto: StartInterviewDto = {
      jobId: job.id,
      interviewId: interview.id,
    };
    try {
      dispatch(startInterview(startInterviewDto)).unwrap();
      router.push('/practice');
    } catch (error) {
      showError('Starting Interview Failed. Please try again later');
    }
  };

  return (
    <Content>
      <Flex p={5} borderRadius="xl" alignItems="center" justifyContent="space-between">
        <Heading size="3xl">Your Mock Interviews</Heading>
        <Box>
          <Tooltip label="Refresh">
            <IconButton
              aria-label="Sync"
              icon={<FiRefreshCw />}
              onClick={() => {
                try {
                  dispatch(fetchJobs()).unwrap();
                } catch (error) {
                  showError('Server Error. Please try again later');
                }
              }}
              size="md"
              mr={3}
            />
          </Tooltip>
          {interview.currentQuestion >= interview.questions.length ? (
            <Button colorScheme="teal" onClick={onOpenRetakeModal}>
              Try this Mock Interview again
            </Button>
          ) : interview.currentQuestion !== 0 ? (
            <Button colorScheme="teal" onClick={handleStart}>
              Continue this Mock Interview
            </Button>
          ) : (
            <Button colorScheme="teal" onClick={handleStart}>
              Start your Mock Interview
            </Button>
          )}
        </Box>
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
        alignItems="stretch"
        justifyContent="space-between"
        p={5}
        mb={3}
        bg="white"
        boxShadow="md"
        borderRadius="xl"
      >
        <Flex direction="column" flex="1">
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
              <Text
                fontSize="lg"
                color={
                  interview.currentQuestion >= interview.questions.length && interview.overallScore
                    ? getColorByScore(interview.overallScore) || 'black'
                    : 'black'
                }
              >
                {interview.currentQuestion >= interview.questions.length
                  ? `${interview?.overallScore}%`
                  : interview.currentQuestion !== 0
                    ? 'Incomplete attempt'
                    : 'No attempt yet'}
              </Text>
            </Box>
          </Flex>
          <Box textAlign="center" mt={3}>
            <Text noOfLines={[1, 2, 3]}>
              <Text fontWeight="bold">Interview Context: </Text>
              {interview?.context ? (
                <Text>{interview?.context}</Text>
              ) : (
                <Text color="gray" fontStyle={'italic'}>
                  N/A
                </Text>
              )}
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
          if (job?.id && interview?.id) {
            try {
              router.push('/job/' + job.id);
              setTimeout(async () => {
                await dispatch(deleteInterview(interview.id)).unwrap();
                showSuccess('Interview Deleted');
              }, 500);
            } catch (error) {
              showError('An Error Occurred', 'Interview Deletion Failed. Please try again later');
            }
          }
        }}
        itemType={'interview'}
      />
      <RetakeInterviewModal
        isOpen={isRetakeModalOpen}
        onClose={onCloseRetakeModal}
        onSubmit={(sameQuestions: boolean) => {
          try {
            router.push('/job/' + job.id);
            dispatch(retakeInterview({ interviewId: interview.id, sameQuestions })).unwrap();
            showSuccess('Interview Duplicated Successfully');
          } catch (error) {
            showError('Interview Duplication Failed. Please try again later');
          }
        }}
      />
      <Box
        alignItems="stretch"
        justifyContent="space-between"
        p={5}
        mb={3}
        bg="white"
        boxShadow="md"
        borderRadius="xl"
      >
        <Heading size="xl">Your Feedback</Heading>
        {interview.currentQuestion >= interview.questions.length ? (
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
    </Content>
  );
};

export default WithAuth(JobPage);
