import * as React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  FocusLock,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  Stack,
  Input,
  FormControl,
  FormLabel,
  Spacer,
  FormErrorMessage,
} from '@chakra-ui/react';
import { JobState, deleteJob, editJob } from '@/redux/features/jobSlice';
import AnimatedButton from '@/components/AnimatedButton';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useRef, useState } from 'react';
import { useCustomToast } from '@/components/Toast';

const JobCards: React.FC<{ cards: JobState }> = ({ cards }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
  const { showSuccess, showError } = useCustomToast();
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});

  const firstFieldRef = useRef<HTMLInputElement>(null);

  const handleTogglePopover = (itemId: string) => {
    setOpenPopovers((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleClosePopover = (itemId: string) => {
    setOpenPopovers((prev) => ({ ...prev, [itemId]: false }));
  };
  const [selectedItem, setSelectedItem] = useState('');

  // Function to open the modal and set the selected item
  const handleOpenDeleteModal = (item: string) => {
    setSelectedItem(item);
    onOpenDeleteModal();
  };

  // Assume we are correctly typing FormProps based on expected props
  interface FormProps {
    firstFieldRef: React.RefObject<HTMLInputElement>;
    onCancel: () => void;
    defaultValue: string;
    jobId: string;
  }

  const Form: React.FC<FormProps> = ({ firstFieldRef, onCancel, defaultValue, jobId }) => {
    const [inputValue, setInputValue] = useState(defaultValue);
    const dispatch = useDispatch<AppDispatch>();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleSave = () => {
      // Dispatch the editJob action with the jobId and new title
      try {
        dispatch(editJob({ id: jobId, updateJobDto: { title: inputValue } })).unwrap();
        onCancel(); // Optionally, close the form or popover after saving
        showSuccess('Job Updated Successfully');
      } catch (error) {
        showError('Job Update Failed. Please try again later');
      }
    };

    return (
      <Stack spacing={4}>
        <FormControl isInvalid={inputValue === ''}>
          <FormLabel htmlFor="job-title">Job Title</FormLabel>
          <Input ref={firstFieldRef} id="job-title" value={inputValue} onChange={handleInputChange} />
          <FormErrorMessage>Job title is required</FormErrorMessage>
        </FormControl>
        <ButtonGroup display="flex" justifyContent="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleSave}
            isDisabled={inputValue === defaultValue || inputValue === ''} // Corrected the logic here
          >
            Save
          </Button>
        </ButtonGroup>
      </Stack>
    );
  };

  return (
    <SimpleGrid spacing={4} templateColumns="repeat(auto-fill, minmax(250px, 1fr))">
      {Object.values(cards.jobs).map((card) => {
        // If there's no card title, don't render the card
        if (!card.title) {
          return null;
        }

        return (
          <Box
            key={card.id}
            boxShadow="md"
            borderRadius="xl"
            p={4}
            display="flex"
            flexDirection="column"
            height="100%"
            backgroundColor={'#fff'}
          >
            <Flex direction="row" justify="space-between">
              <Popover
                returnFocusOnClose={false}
                isOpen={openPopovers[card.id] || false}
                onClose={() => handleClosePopover(card.id)}
                placement="bottom-start"
                closeOnBlur={false}
              >
                <VStack spacing={2} align="stretch" flexGrow={1}>
                  <PopoverTrigger key={card.title}>
                    <Heading size="md" noOfLines={2} minHeight={'0em'} overflow="visible">
                      {card.title}
                    </Heading>
                  </PopoverTrigger>

                  <Heading size="sm" noOfLines={2}>
                    {card.company}
                  </Heading>
                  <Text noOfLines={1}>{card.location}</Text>
                </VStack>
                <Menu placement="bottom">
                  <MenuButton as={IconButton} aria-label="Options" icon={<FaEllipsisVertical />} size="sm" />
                  <MenuList>
                    <MenuItem icon={<EditIcon />} onClick={() => handleTogglePopover(card.id)}>
                      Rename Job
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={() => handleOpenDeleteModal(card.id)}>
                      Delete Job
                    </MenuItem>
                  </MenuList>
                </Menu>
                <PopoverContent p={5}>
                  <FocusLock persistentFocus={false}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <Form
                      firstFieldRef={firstFieldRef}
                      onCancel={() => handleClosePopover(card.id)}
                      defaultValue={card.title}
                      jobId={card.id}
                    />
                  </FocusLock>
                </PopoverContent>
              </Popover>
            </Flex>
            <br />
            <Spacer />
            <Button as={AnimatedButton} colorScheme="blue" destination={'/job/' + card.id}>
              Get Practicing
            </Button>
          </Box>
        );
      })}

      <ConfirmDeleteModal
        key={selectedItem}
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        onDelete={async () => {
          if (selectedItem) {
            // Check if job?.id is not undefined
            try {
              await dispatch(deleteJob(selectedItem)).unwrap();
              showSuccess('Job Deleted Successfully');
            } catch (error) {
              showError('Job Deletion Failed. Please try again later');
            }
          }
        }}
        itemType={'job'}
      />
    </SimpleGrid>
  );
};

export default JobCards;
