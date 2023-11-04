import * as React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import JobModal from "./jobModal";

const Header: React.FC = () => {
  // Hooks to manage modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      bg="white"
      p={5}
      boxShadow="md"
      borderRadius="xl"
      alignItems="center"
      justifyContent="space-between"
    >
      <Heading size="3xl">Your Jobs</Heading>
      <Button colorScheme="teal" onClick={onOpen}>
        Add a Job
      </Button>

      {/* The modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <JobModal />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Header;
