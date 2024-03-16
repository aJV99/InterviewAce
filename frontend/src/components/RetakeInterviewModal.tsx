import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Center,
  Tooltip,
} from '@chakra-ui/react';

interface RetakeInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sameQuestions: boolean) => void;
}

const RetakeInterviewModal: React.FC<RetakeInterviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Retake Interview</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Would you like the SAME QUESTIONS when you retake this interview or would you like NEW QUESTIONS based
            on the same Interview specifications?
          </Text>
        </ModalBody>

        <ModalFooter>
          <Center w="full">
            <Tooltip textAlign="center" label="Remember that real interviews won't have these specific questions">
              <Button
                w="50%"
                colorScheme="green"
                onClick={() => {
                  onSubmit(true);
                  onClose(); // Optionally close the modal after deletion
                }}
              >
                Same Questions
              </Button>
            </Tooltip>
            <Text m={3}>OR</Text>
            <Button
              w="50%"
              colorScheme="blue"
              onClick={() => {
                onSubmit(false);
                onClose(); // Optionally close the modal after deletion
              }}
            >
              New Questions
            </Button>
          </Center>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RetakeInterviewModal;
