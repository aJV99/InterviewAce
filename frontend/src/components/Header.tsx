import * as React from 'react';
import {
  Heading,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import JobModal from '@/components/JobModal';

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex py={5} borderRadius="xl" alignItems="center" justifyContent="space-between">
      <Heading size="3xl">Your Jobs</Heading>
      <Button colorScheme="teal" onClick={onOpen}>
        Add a Job
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <JobModal onClose={onClose} />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Header;
