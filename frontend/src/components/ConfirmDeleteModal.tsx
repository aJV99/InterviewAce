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
  Tooltip,
} from '@chakra-ui/react';
import { toCapitalCase } from '@/app/utils';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemType: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onDelete, itemType }) => {
  let grammarItemType;
  if (itemType === ('job' || 'interview')) {
    grammarItemType = 'this ' + itemType;
  } else {
    grammarItemType = 'your ' + itemType;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {toCapitalCase(itemType)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to delete {grammarItemType}? This action cannot be undone.</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Tooltip label="Last Warning!">
            <Button
              colorScheme="red"
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              Delete
            </Button>
          </Tooltip>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;
