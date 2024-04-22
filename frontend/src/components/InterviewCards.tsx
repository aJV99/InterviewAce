import * as React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  ButtonGroup,
  Stack,
  Flex,
  Popover,
  PopoverTrigger,
  FocusLock,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  useDisclosure,
  Spacer,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Interview } from '@/redux/dto/interview.dto';
import AnimatedButton from '@/components/AnimatedButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useRef, useState } from 'react';
import { deleteInterview, emptyLoading, retakeInterview, updateInterview } from '@/redux/features/jobSlice';
import { EditIcon, DeleteIcon, CopyIcon } from '@chakra-ui/icons';
import { FaEllipsisVertical } from 'react-icons/fa6';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import RetakeInterviewModal from '@/components/RetakeInterviewModal';
import { useCustomToast } from '@/components/Toast';
import { getColorByScore, toCapitalCase } from '@/app/utils';

const InterviewCards: React.FC<{ cards: Interview[] | undefined }> = ({ cards }) => {
  const jobLoading = useSelector((state: RootState) => state.jobs.loadingInterview);
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
  const { isOpen: isRetakeModalOpen, onOpen: onOpenRetakeModal, onClose: onCloseRetakeModal } = useDisclosure();
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useCustomToast();

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

  const handleOpenRetakeModal = (item: string) => {
    setSelectedItem(item);
    onOpenRetakeModal();
  };

  // Assume we are correctly typing FormProps based on expected props
  interface FormProps {
    firstFieldRef: React.RefObject<HTMLInputElement>;
    onCancel: () => void;
    defaultValue: string;
    interviewId: string;
  }

  const Form: React.FC<FormProps> = ({ firstFieldRef, onCancel, defaultValue, interviewId }) => {
    const [inputValue, setInputValue] = useState(defaultValue);
    const dispatch = useDispatch<AppDispatch>();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleSave = () => {
      // Dispatch the updateInterview action with the interviewId and new title
      try {
        dispatch(updateInterview({ id: interviewId, updateInterviewDto: { title: inputValue } })).unwrap();
        onCancel(); // Optionally, close the form or popover after saving
        showSuccess('Interview Updated Successfully');
      } catch (error) {
        showError('Interview Update Failed. Please try again later');
      }
    };

    return (
      <Stack spacing={4}>
        <FormControl isInvalid={inputValue === ''}>
          <FormLabel htmlFor="interview-title">Interview Title</FormLabel>
          <Input ref={firstFieldRef} id="interview-title" value={inputValue} onChange={handleInputChange} />
          <FormErrorMessage>Interview title is required</FormErrorMessage>
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
      {cards?.map((card) => {
        if (card.currentQuestion === card.questions.length && card.id === jobLoading) {
          dispatch(emptyLoading(card.id));
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
                    <Heading size="md" noOfLines={2} minHeight={'0em'}>
                      {card.title}
                    </Heading>
                  </PopoverTrigger>

                  <Heading size="sm" noOfLines={2}>
                    {card.customType ? `Other - ${card.customType}` : toCapitalCase(card.type)}
                  </Heading>
                  <Text
                    noOfLines={1}
                    color={
                      card.currentQuestion >= card.questions.length && card.overallScore
                        ? getColorByScore(card.overallScore) || 'black'
                        : 'black'
                    }
                  >
                    {jobLoading === card.id
                      ? 'Interview Finished'
                      : card.currentQuestion >= card.questions.length
                        ? `${card?.overallScore}%`
                        : card.currentQuestion !== 0
                          ? 'Incomplete attempt'
                          : 'No attempt yet'}
                  </Text>
                </VStack>
                <Menu placement="bottom">
                  <MenuButton as={IconButton} aria-label="Options" icon={<FaEllipsisVertical />} size="sm" />
                  <MenuList>
                    {!(card.currentQuestion === card.questions.length && card.id === jobLoading) && (
                      <MenuItem icon={<EditIcon />} onClick={() => handleTogglePopover(card.id)}>
                        Rename Interview
                      </MenuItem>
                    )}
                    <MenuItem icon={<CopyIcon />} onClick={() => handleOpenRetakeModal(card.id)}>
                      Duplicate Interview
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={() => handleOpenDeleteModal(card.id)}>
                      Delete Interview
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
                      interviewId={card.id}
                    />
                  </FocusLock>
                </PopoverContent>
              </Popover>
            </Flex>
            <br />
            <Spacer />
            <AnimatedButton
              colorScheme="blue"
              destination={'/interview/' + card.jobId + '/' + card.id}
              isLoading={jobLoading === card.id ? true : false}
              loadingText="Generating Feedback"
            >
              Get Practicing
            </AnimatedButton>
          </Box>
        );
      })}
      <ConfirmDeleteModal
        key={selectedItem + 'delete'}
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        onDelete={async () => {
          if (selectedItem) {
            // Check if job?.id is not undefined
            try {
              dispatch(deleteInterview(selectedItem)).unwrap();
              showSuccess('Interview Deleted Successfully');
            } catch (error) {
              showError('Interview Deletion Failed. Please try again later');
            }
          }
        }}
        itemType={'interview'}
      />
      <RetakeInterviewModal
        key={selectedItem + 'retake'}
        isOpen={isRetakeModalOpen}
        onClose={onCloseRetakeModal}
        onSubmit={(sameQuestions: boolean) => {
          try {
            dispatch(retakeInterview({ interviewId: selectedItem, sameQuestions })).unwrap();
            showSuccess('Interview Duplication Successfully');
          } catch (error) {
            showError('Interview Duplication Failed. Please try again later');
          }
        }}
      />
    </SimpleGrid>
  );
};

export default InterviewCards;
