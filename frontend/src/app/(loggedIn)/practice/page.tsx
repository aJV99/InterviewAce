'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { answerQuestion, fetchJobs, updateInterview } from '@/redux/features/jobSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { toCapitalCase } from '@/app/utils';
import { FaUpRightAndDownLeftFromCenter } from 'react-icons/fa6';
import StatusIndicator from '@/components/StatusIcon';
import Timer from '@/components/Timer';
import useSound from 'use-sound';
import useSpeaker from '@/components/useSpeaker';
import useMicrophone from '@/components/useMicrophone';
import SetupModal from '@/components/SetupModal';
import RecordingAnimation from '@/components/RecordingAnimation';
import interviewTips from './InterviewTips';
import TipsCarousel from '@/components/TipsCarousel';
import useAnimatedRouter from '@/components/useAnimatedRouter';

const PracticePage: React.FC = () => {
  const [interviewStatus, setInterviewStatus] = useState<string>('Not Started');
  const [testsPassed, setTestsPassed] = useState<boolean>(false);
  const { isOpen: isCountdownOpen, onOpen: onOpenCountdown, onClose: onCloseCountdown } = useDisclosure();
  const { isOpen: isTranscriptionTestOpen, onOpen: onOpenTranscriptionTest } = useDisclosure();
  const { isOpen: isExpandOpen, onOpen: onOpenExpand, onClose: onCloseExpand } = useDisclosure();
  const [expandText, setExpandText] = useState<string[]>(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdownText, setCountdownText] = useState<string>('3');
  const [playTickSound] = useSound('/sounds/tick.mp3');
  const [playAnswerSound] = useSound('/sounds/answer.mp3');
  const dispatch = useDispatch<AppDispatch>();
  const currentInterview = useSelector((state: RootState) => state.jobs.currentInterview);
  const jobsState = useSelector((state: RootState) => state.jobs);
  const router = useAnimatedRouter();

  useEffect(() => {
    if (!jobsState.fetched) {
      dispatch(fetchJobs());
    }
    onOpenTranscriptionTest();
  }, [dispatch, jobsState, onOpenTranscriptionTest]);

  const job = jobsState.jobs[currentInterview.jobId];
  const interview = job?.interviews[currentInterview.interviewId];

  if (!job || !interview) {
    throw Error;
  }

  const [questionIndex, setQuestionIndex] = useState(interview.currentQuestion);

  const questions = interview.questions;
  const startRecording = () => {
    startListening(); // Start listening after the countdown
    onOpenCountdown(); // Open the modal
    playTickSound();
    const countdownValues = ['2', '1', 'Answer!'];
    let index = 0;

    const countdownInterval = setInterval(() => {
      if (index < countdownValues.length) {
        setCountdownText(countdownValues[index]);
        index++;
        if (index != countdownValues.length) {
          playTickSound();
        } else {
          playAnswerSound();
        }
      } else {
        clearInterval(countdownInterval);
        onCloseCountdown(); // Close the modal
        setCountdownText('3'); // Reset countdown text
        setIsListening(true);
      }
    }, 1000);
  };

  const leave = (complete: boolean) => {
    quit();
    if (!complete) {
      dispatch(
        updateInterview({
          id: interview.id,
          updateInterviewDto: {
            currentQuestion: questionIndex - 1 >= 0 ? questionIndex - 1 : 0,
          },
        }),
      );
      router.push(`/interview/${job.id}/${interview.id}`);
    } else {
      router.push(`/job/${job.id}`);
    }
  };

  const handleResult = (whatUserSaid: string) => {
    if (interviewStatus !== 'Not Started') {
      dispatch(
        answerQuestion({
          questionId: questions[questionIndex - 1].id,
          response: whatUserSaid,
          interviewId: interview.id,
        }),
      );
      nextQuestion(questionIndex);
      setIsLoading(false);
    }
  };

  const setTestsPassedTrue = () => setTestsPassed(true);

  const {
    status,
    setStatus,
    transcript,
    setTranscript,
    isListening,
    setIsListening,
    startListening,
    stopListening,
    quit,
  } = useMicrophone(handleResult, testsPassed, 'This is a microphone test.', setTestsPassedTrue);

  const handleSpeakerResult = () => {
    if (testsPassed) {
      setQuestionIndex((prevIndex) => {
        const updatedIndex = prevIndex + 1;
        if (updatedIndex !== questions.length + 1) {
          startRecording();
        }
        return updatedIndex;
      });
    } else {
      setStatus('CHECK!');
    }
  };

  const { isSpeaking, spokenText, setSpokenText, handleSpeak } = useSpeaker(handleSpeakerResult);

  const nextQuestion = useCallback(
    (index: number) => {
      setSpokenText('');
      if (index < questions.length) {
        handleSpeak(questions[index].content);
      } else {
        setInterviewStatus('Complete');
        handleSpeak("Thank you for attending this interview. We'll be contacting you soon about your feedback!");
      }
    },
    [questions, handleSpeak, setSpokenText],
  );

  const startInterview = () => {
    setTranscript('');
    setInterviewStatus('Started');
    nextQuestion(questionIndex);
  };

  const startListeningForTest = () => {
    if (!testsPassed) {
      setTranscript('');
      setStatus('');
    }
    startRecording();
  };

  const number = () => {
    const num = Math.round((questionIndex / questions.length) * 100);
    if (num > 100) {
      return 100;
    } else {
      return num;
    }
  };

  return (
    <Box bg="blue.800">
      <Flex minHeight="100vh" direction="column" bg="blue.800" color="white" p={10}>
        {/* Top section - Quit button and Microphone status */}
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Box textAlign="left" width="25vw">
            <Button
              onClick={() => {
                if (interviewStatus === 'Complete') {
                  leave(true);
                } else {
                  leave(false);
                }
              }}
              size="sm"
              leftIcon={<ChevronLeftIcon />}
              colorScheme="teal"
              isDisabled={isSpeaking}
            >
              Quit
            </Button>
          </Box>
          <Box textAlign="center" width="50vw">
            <Heading as="h1" size="lg">
              {interview.title}
            </Heading>
            <Text fontSize="md">
              {job.title} - {interview.customType ? `${interview.customType}` : toCapitalCase(interview.type)}{' '}
              Interview - {job.company}
            </Text>
          </Box>
          <Box textAlign="right" alignItems="right" width="25vw">
            <CircularProgress value={number()} size="4rem" color="green.400">
              <CircularProgressLabel>{number()}%</CircularProgressLabel>
            </CircularProgress>
          </Box>
        </Flex>
        <Box>
          {interviewStatus === 'Not Started' && testsPassed && (
            <>
              <Flex alignItems="center" justifyContent="center" mt="10" mb="20">
                <Tooltip textAlign="center" label="Be sure to enunciate your words so Ace can hear you!">
                  <Button colorScheme="teal" onClick={() => startInterview()} isDisabled={isSpeaking} size="lg">
                    Start Mock Interview
                  </Button>
                </Tooltip>
              </Flex>
              <Grid templateColumns="repeat(2, 1fr)" gap={20}>
                <GridItem maxW="100%" h="10">
                  <Heading lineHeight="tall" fontSize="3xl" mb="3">
                    Top Tips and Tricks from Ace
                  </Heading>
                  <TipsCarousel items={interviewTips} />
                </GridItem>
                <GridItem h="10">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th width="48" color="white"></Th>
                        <Th color="white"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td fontWeight="semibold">Job Title</Td>
                        <Td>{job.title}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="semibold">Job Company</Td>
                        <Td>{job.company}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="semibold">Job Description</Td>
                        <Td>
                          <Flex alignItems="center">
                            <Text noOfLines={2}>{job.description}</Text>
                            <Spacer />
                            <IconButton
                              size="sm"
                              icon={<FaUpRightAndDownLeftFromCenter />}
                              aria-label={''}
                              onClick={() => {
                                setExpandText(['Job Description', `${job.description}`]);
                                onOpenExpand();
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="semibold">Job Title</Td>
                        <Td>{job.location}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="semibold">Interview Title</Td>
                        <Td>{interview.title}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="semibold">Interview Type</Td>
                        <Td>{interview.type}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="semibold">Interview Context</Td>
                        <Td>
                          <Flex alignItems="center">
                            <Text noOfLines={2}>{interview.context}</Text>
                            <Spacer />
                            <IconButton
                              size="sm"
                              icon={<FaUpRightAndDownLeftFromCenter />}
                              aria-label={''}
                              onClick={() => {
                                setExpandText(['Interview Context', `${interview.context}`]);
                                onOpenExpand();
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </GridItem>
              </Grid>
            </>
          )}
        </Box>
        {testsPassed && interviewStatus != 'Not Started' && (
          <Container
            maxW="container.lg"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)" // Center the box
            width="full" // Take up the full width of its parent
            textAlign="center" // Center text within the box
            mb="28"
          >
            <Heading fontSize="5xl" textAlign="center">
              {spokenText}
            </Heading>
          </Container>
        )}

        {/* Bottom section for isListening elements */}
        {testsPassed && isListening && interviewStatus !== 'Not Started' && (
          <>
            <Spacer />

            <Flex direction="column" alignItems="center" mb={4}>
              <>
                <Flex justifyContent="center" alignItems="center">
                  <RecordingAnimation />
                </Flex>
                <Flex justifyContent="center" alignItems="center" gap="2" mt={4}>
                  <StatusIndicator />
                  <Text fontWeight="bold" fontSize="lg">
                    Recording...
                  </Text>
                  <Timer />
                </Flex>
                <Tooltip
                  textAlign="center"
                  label="Take a beat before submitting so Ace can note down what you said"
                >
                  <Button
                    size="lg"
                    onClick={() => {
                      setIsLoading(true);
                      stopListening();
                    }}
                    disabled={!isListening}
                    isLoading={isLoading}
                    mt={4}
                  >
                    Submit Answer
                  </Button>
                </Tooltip>
              </>
            </Flex>
          </>
        )}

        {testsPassed && interviewStatus === 'Complete' && (
          <>
            <Spacer />

            <Flex direction="column" alignItems="center" mb={4}>
              <>
                <Button
                  size="lg"
                  onClick={() => {
                    leave(true);
                  }}
                  isDisabled={isSpeaking}
                  mt={4}
                >
                  End Interview
                </Button>
              </>
            </Flex>
          </>
        )}

        {/* Countdown Modal */}
        <Modal isOpen={isCountdownOpen} onClose={() => {}} isCentered size="xl">
          <ModalOverlay />
          <ModalContent background="transparent" boxShadow="none">
            <ModalBody display="flex" alignItems="center" justifyContent="center">
              <Heading fontSize="6xl" color="white">
                {countdownText}
              </Heading>
            </ModalBody>
          </ModalContent>
        </Modal>

        {!testsPassed && (
          <Modal isOpen={isTranscriptionTestOpen} onClose={() => {}} isCentered size="xl">
            <SetupModal
              transcript={transcript}
              status={status}
              isListening={isListening}
              onNext={() => {
                setStatus('');
                setSpokenText('');
              }}
              onSpeak={() => {
                handleSpeak('This is a speaker test.');
              }}
              onListen={startListeningForTest}
            />
          </Modal>
        )}

        <Modal onClose={onCloseExpand} isOpen={isExpandOpen} size={'3xl'} scrollBehavior={'inside'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{expandText[0]}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{expandText[1]}</ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  );
};

export default PracticePage;
