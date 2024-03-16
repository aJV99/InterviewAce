'use client';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Content } from '@/components/ContentContainer';
import WithAuth from '@/redux/features/authHoc';
import { fetchJobs } from '@/redux/features/jobSlice';
import { Flex, Heading } from '@chakra-ui/react';
import AccountProfile from '@/components/AccountProfile';
import { useCustomToast } from '@/components/Toast';

const SettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showError } = useCustomToast();
  const jobs = useSelector((state: RootState) => state.jobs); // Make sure this points to the jobs array within the JobState.

  if (!jobs.fetched) {
    try {
      dispatch(fetchJobs()).unwrap();
    } catch (error) {
      showError('Server Error. Please try again later');
    }
  }

  return (
    <Content>
      <Flex py={5} borderRadius="xl" alignItems="center" justifyContent="space-between">
        <Heading size="3xl">Account Settings</Heading>
      </Flex>
      <AccountProfile />
    </Content>
  );
};

export default WithAuth(SettingsPage);
