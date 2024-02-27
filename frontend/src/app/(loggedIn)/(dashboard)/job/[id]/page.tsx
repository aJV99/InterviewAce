"use client";
import { Content } from "@/components/contentContainer";
import WithAuth from "@/redux/features/authHoc";
import { useEffect } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Bubble from "@/components/bubble";
import { useRouter } from "next/navigation";
import JobModal from "@/components/jobModal";
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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import InterviewCards from "@/components/interviewCards";
import InterviewModal from "@/components/interviewModal";
import { fetchJobs, deleteJob } from "@/redux/features/jobSlice";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";

const JobPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { isOpen: isJobModalOpen, onOpen: onOpenJobModal, onClose: onCloseJobModal } = useDisclosure();
  const {
    isOpen: isInterviewModalOpen,
    onOpen: onOpenInterviewModal,
    onClose: onCloseInterviewModal,
  } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const jobsState = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    // Check if the jobs are fetched or fetch if necessary
    if (!jobsState.fetched) {
      dispatch(fetchJobs());
    }
  }, [dispatch, jobsState]);

  // Find the job in the state (this will be re-evaluated when the state changes)
  const job = jobsState.jobs.find((job) => job.id === params.id);

  if (!job) {
    throw Error;
  }

  return (
    <Content>
      <Bubble>
        <Flex p={5} borderRadius="xl" alignItems="center" justifyContent="space-between">
          <Heading size="3xl">Your Mock Interviews</Heading>
          <Button
            isLoading={jobsState.creatingInterview}
            loadingText="Creating your interview and jobs"
            colorScheme="teal"
            onClick={onOpenInterviewModal}
          >
            Add a Interview
          </Button>

          {/* The modal */}
          <Modal isOpen={isJobModalOpen} onClose={onCloseJobModal} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <JobModal onClose={onCloseJobModal} isEditing={true} existingJob={job} />
            </ModalContent>
          </Modal>

          <Modal isOpen={isInterviewModalOpen} onClose={onCloseInterviewModal} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <InterviewModal onClose={onCloseInterviewModal} jobId={params.id} />
            </ModalContent>
          </Modal>
        </Flex>
        <Flex
          alignItems="stretch" // To ensure the Edit button can be centered across the full height
          justifyContent="space-between"
          p={5}
          mb={3}
          bg="white"
          boxShadow="md"
          borderRadius="xl"
        >
          {/* Left side: Role, Company, Location, and Job Description */}
          <Flex direction="column" flex="1">
            {/* Top Row: Role, Company, Location */}
            <Flex>
              <Box flex="1" textAlign="center">
                <Text fontWeight="bold">Role: </Text>
                <Text>{job?.title}</Text>
              </Box>
              <Box flex="1" textAlign="center">
                <Text fontWeight="bold">Company: </Text>
                <Text>{job?.company}</Text>
              </Box>
              <Box flex="1" textAlign="center">
                <Text fontWeight="bold">Location: </Text>
                <Text>{job?.location}</Text>
              </Box>
            </Flex>
            {/* Bottom Row: Job Description */}
            <Box textAlign="center" mt={3}>
              <Text noOfLines={[1, 2, 3]}>
                <Text fontWeight="bold">Role Description: </Text>
                {job?.description}
              </Text>
            </Box>
          </Flex>

          {/* Right side: Edit Button */}
          <VStack alignItems="center" justifyContent="center" px={4} spacing={5}>
            <IconButton
              aria-label="Edit job"
              icon={<EditIcon />}
              onClick={onOpenJobModal}
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
            if (job?.id) {
              // Check if job?.id is not undefined
              dispatch(deleteJob(job.id));
              router.push("/dashboard");
            } else {
              console.error("Job ID is undefined");
              // Optionally, handle the undefined ID case (e.g., showing an error message)
            }
          }}
          itemType={"job"}
        />
        {/* <Suspense fallback={<Loading />}> */}
        <InterviewCards cards={job?.interviews} />
        {/* </Suspense> */}
      </Bubble>
    </Content>
  );
};

export default WithAuth(JobPage);
