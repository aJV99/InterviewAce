'use client';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Content } from '@/components/ContentContainer';
import WithAuth from '@/redux/features/authHoc';
import Header from '@/components/Header';
import JobCards from '@/components/JobCards';
import { fetchJobs } from '@/redux/features/jobSlice';
import Bubble from '@/components/Bubble';
import { Box, Flex, Heading, Image } from '@chakra-ui/react';

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const jobs = useSelector((state: RootState) => state.jobs); // Make sure this points to the jobs array within the JobState.

  if (!jobs.fetched) {
    dispatch(fetchJobs());
  }

  return (
    <Content>
      <Bubble p={5} m={-1} bg="#e0f0ff">
        <Flex direction="row" width="full">
          <Image
            src="/Ace.webp"
            width="20%"
            height="fit-content"
            mx={28}
            alt="An image of Ace, InterviewAce's helpful AI assistamt"
          />
          <Box textAlign="center" justifySelf="center" alignSelf="center">
            <Heading color="blue.600" fontSize="6xl">
              {`Hi ${auth.firstName}, I'm Ace!`}
            </Heading>
            <Heading fontSize="3xl">
              Ready to <span style={{ fontStyle: 'italic' }}>{'ace'}</span> those interviews?
            </Heading>
          </Box>
        </Flex>
      </Bubble>
      <Header />
      <JobCards cards={jobs} />
    </Content>
  );
};

export default WithAuth(DashboardPage);
