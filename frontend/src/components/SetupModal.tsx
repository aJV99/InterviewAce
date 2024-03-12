import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Text,
  ModalBody,
  Box,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepNumber,
  StepIcon,
  StepTitle,
  StepDescription,
  StepSeparator,
  ModalFooter,
  Spacer,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';

interface SetupModalProps {
  transcript: string;
  status: string;
  isListening: boolean;
  onNext: () => void;
  onSpeak: () => void;
  onListen: () => void;
}

const SetupModal: React.FC<SetupModalProps> = ({ transcript, status, isListening, onNext, onSpeak, onListen }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const testsSteps = [
    { title: 'Speaker Test', description: 'Ace wants to you to hear!', phrase: 'This is a speaker test.' },
    { title: 'Microphone Test', description: 'Ace wants to hear you!', phrase: 'This is a microphone test.' },
  ];

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pre-Interview Setup Tests</ModalHeader>
        <ModalBody>
          <Box width="100%" mb={4}>
            <Stepper index={currentStep}>
              {testsSteps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={currentStep - 1 == index ? <StepNumber /> : <StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>
          {currentStep === 1 && (
            <>
              <Text mb={2}>Please start the speaker test to ensure your audio output is working correctly.</Text>
              {status == 'CHECK!' && (
                <>
                  <Text fontWeight="bold">{`Did you hear this phrase: "${testsSteps[0].phrase}"`}</Text>
                </>
              )}
            </>
          )}
          {currentStep === 2 && (
            <>
              <Text>Please say the following phrase to test your microphone:</Text>
              <Text fontWeight="bold">{`"` + testsSteps[1].phrase + `"`}</Text>
              <Text fontWeight="bold">What you said: {`"` + transcript + `"`}</Text>
              <Text fontWeight="bold" color={status === 'SUCCESS!' ? 'green.500' : 'red.500'}>
                {status}
              </Text>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Text fontSize="sm" color="red.500">
            This modal will close when the tests have been passed.
          </Text>
          <Spacer />
          {currentStep === 1 && (
            <>
              {status == 'CHECK!' ? (
                <>
                  <ButtonGroup>
                    <Button
                      colorScheme="blue"
                      onClick={
                        // onNext()
                        () => {
                          onNext();
                          setCurrentStep(2);
                        }
                      }
                    >
                      Yes
                    </Button>
                    <Button>No</Button>
                  </ButtonGroup>
                </>
              ) : (
                <>
                  <Button colorScheme="blue" mr={3} onClick={onSpeak}>
                    Start Test
                  </Button>
                </>
              )}
            </>
          )}
          {currentStep === 2 && (
            <>
              <Button colorScheme="blue" mr={3} onClick={onListen} isDisabled={isListening}>
                Start Test
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default SetupModal;
