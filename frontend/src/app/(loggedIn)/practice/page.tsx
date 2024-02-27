"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { fetchJobs } from "@/redux/features/jobSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { findPunctuationMarks, toCapitalCase } from "@/app/utils";
import { FaMicrophone } from "react-icons/fa";
import StatusIndicator from "@/components/StatusIcon";
import Timer from "@/components/Timer";
import useSound from "use-sound";

const PracticePage: React.FC = () => {
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [transcriptionTestPassed, setTranscriptionTestPassed] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const { isOpen: isCountdownOpen, onOpen: onOpenCountdown, onClose: onCloseCountdown } = useDisclosure();
  const {
    isOpen: isTranscriptionTestOpen,
    onOpen: onOpenTranscriptionTest,
    onClose: onCloseTranscriptionTest,
  } = useDisclosure();
  const [countdownText, setCountdownText] = useState<string>("3");
  const [playTickSound] = useSound("/sounds/tick.mp3");
  const [playAnswerSound] = useSound("/sounds/answer.mp3");

  const testPhrase = "This is a microphone test.";

  // Use a ref to keep a stable reference to the recognition object across re-renders
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Your browser does not support the Web Speech API. Please use the latest versions of any of the following browsers: Google Chrome, Microsoft Edge, Mozilla Firefox",
      );
      return;
    }

    // Initialize recognition object and assign it to the ref
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true; // Keep listening even if the user pauses
    recognitionRef.current.lang = "en-GB";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const transcriptResult = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setTranscript(transcriptResult);
      console.log(transcriptResult);
      if (!transcriptionTestPassed && transcriptResult == testPhrase) {
        console.log("TEST WOOHOO");
        setTranscriptionTestPassed(true);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null; // Reset the ref after stopping
          setIsListening(false);
          setTranscript("");
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null; // Reset the ref after stopping
      setIsListening(false);
      setTranscript("");
      nextQuestion(questionIndex);
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const currentInterview = useSelector((state: RootState) => state.jobs.currentInterview);
  const jobsState = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    // Check if the jobs are fetched or fetch if necessary
    if (!jobsState.fetched) {
      dispatch(fetchJobs());
    }
    onOpenTranscriptionTest();
  }, [dispatch, jobsState, onOpenTranscriptionTest]);

  // Find the job in the state (this will be re-evaluated when the state changes)
  const job = jobsState.jobs.find((job) => job.id === currentInterview.jobId);
  const interview = job?.interviews.find((interview) => interview.id === currentInterview.interviewId);

  if (!job || !interview) {
    throw Error;
  }

  const questions = interview.questions;
  const speechSynthesisUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const voices = speechSynthesis.getVoices();
  const selectedVoice = voices.find((voice) => voice.lang.startsWith("en-GB"));

  const handleSpeak = (text: string) => {
    const punctuationMap = findPunctuationMarks(text);
    console.log(punctuationMap);

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.current = utterance;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.log("Preferred language voice not found, using default.");
    }

    // Set properties for the speech synthesis
    utterance.rate = 1; // Adjust as needed
    utterance.pitch = 1; // Adjust as needed

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      startRecording();
    };

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        let word = text.slice(event.charIndex, event.charIndex + event.charLength);
        if (punctuationMap.length != 0 && event.charIndex + event.charLength == punctuationMap[0].index) {
          word += punctuationMap[0].character;
          punctuationMap.shift();
        }
        setSpokenText((prev) => `${prev} ${word}`);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const nextQuestion = (index: number) => {
    if (questionIndex < questions.length) {
      setQuestionIndex(questionIndex + 1);
      setSpokenText("");
      handleSpeak(questions[index].content);
      console.log("Complete");
    } else {
      console.log("done");
    }
  };

  const startRecording = () => {
    startListening(); // Start listening after the countdown
    onOpenCountdown(); // Open the modal
    playTickSound();
    const countdownValues = ["2", "1", "Answer!"];
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
        setCountdownText("3"); // Reset countdown text
        setIsListening(true);
      }
    }, 1000);
  };

  const startInterview = () => {
    setTranscript("");
    setInterviewStarted(true);
    nextQuestion(questionIndex);
  };

  const startListeningForTest = () => {
    startRecording();
  };

  return (
    <Flex minHeight="100vh" bg="blue.800" color="white" p={10} direction="column">
      {!transcriptionTestPassed && (
        <Modal isOpen={isTranscriptionTestOpen} onClose={() => {}} isCentered size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Microphone Test</ModalHeader>
            <ModalBody>
              <Text>Please say the following phrase to test your microphone:</Text>
              <Text fontWeight="bold">{`"` + testPhrase + `"`}</Text>
              <Text fontWeight="bold">What you said: {`"` + transcript + `"`}</Text>

              {/* You can add a button or automatically start listening */}
            </ModalBody>
            <ModalFooter>
              <Text fontSize="sm" color="red.500">
                This modal will automatically close when the test has passed
              </Text>
              <Spacer />
              <Button colorScheme="blue" mr={3} onClick={startListeningForTest}>
                {isListening ? "Retry Test" : "Start Test"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {/* Header with three sections */}
      <Flex width="full" justifyContent="space-between" alignItems="center" mb={8}>
        {/* Left-aligned section */}
        <Box textAlign="left" width="25vw">
          <Button size="sm" leftIcon={<ChevronLeftIcon />} colorScheme="teal">
            Quit
          </Button>
        </Box>

        {/* Center-aligned section */}
        <Box textAlign="center" width="50vw">
          <Heading as="h1" size="lg" mb={2}>
            {interview.title}
          </Heading>
          <Text fontSize="md">
            {job.title} - {interview.customType ? `${interview.customType}` : toCapitalCase(interview.type)}{" "}
            Interview - {job.company}
          </Text>
        </Box>

        {/* Right-aligned section */}
        <Box textAlign="right" width="25vw">
          <Text fontSize="md">Right-aligned content</Text>
        </Box>
      </Flex>

      {/* Audio Check Component */}
      {/* <AudioCheck /> */}

      <Container maxW="container.lg" py={16}>
        <Heading fontSize="5xl" my={11} textAlign="center">
          {spokenText}
        </Heading>
      </Container>
      <Box textAlign="center">
        {!interviewStarted && (
          <Button colorScheme="teal" onClick={() => startInterview()} disabled={isSpeaking} size="lg">
            {isSpeaking ? "Stop Speaking" : "Start Mock Interview"}
          </Button>
        )}
        {isListening && (
          <>
            <Heading mb="10">{transcript}</Heading>
            <Text mb="5" fontWeight="bold">
              Listening...
            </Text>
            <Flex mb="5" justifyContent="center" alignItems="center" gap="0.5">
              <Icon as={FaMicrophone} color="red.500" w={6} h={6} />
              <StatusIndicator />
              <Timer />
            </Flex>
            <Button mb="5" onClick={stopListening} disabled={!isListening}>
              Submit Answer
            </Button>
          </>
        )}
      </Box>
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
    </Flex>
  );
};

export default PracticePage;
