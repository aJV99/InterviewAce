import { PlusSquareIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Input,
  InputRightElement,
  Icon,
  useDisclosure,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { FiUser, FiLock, FiEdit2, FiMail, FiLink, FiSave } from 'react-icons/fi';
import CustomAvatar from './CustomAvatar';
import Bubble from './Bubble';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { deleteUser, getUser, updatePassword, updateUser } from '@/redux/features/authSlice';
import { deleteData } from '@/redux/features/jobSlice';
import { useCustomToast } from './Toast';
import { ErrorDto } from '@/app/error';

const AccountProfile: React.FC = () => {
  const [profileTab, setProfileTab] = useState<boolean>(true);
  const [editable, setEditable] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const {
    isOpen: isDeleteAccountOpen,
    onOpen: onOpenDeleteAccount,
    onClose: onCloseDeleteAccount,
  } = useDisclosure();
  const { isOpen: isDeleteDataOpen, onOpen: onOpenDeleteData, onClose: onCloseDeleteData } = useDisclosure();
  const auth = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [inputErrors, setInputErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const { showSuccess, showError } = useCustomToast();

  useEffect(() => {
    if (auth.user) {
      setName(auth.firstName + ' ' + auth.lastName); // Adjust according to your user object structure
      setEmail(auth.user.email); // Adjust according to your user object structure
      // Assume you have LinkedIn or some connected account info in your user object
      setLinkedIn(auth.user.linkedInId || '');
    } else {
      try {
        dispatch(getUser()).unwrap();
      } catch (error) {
        showError('Server Error. Please try again later');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  const handleSave = () => {
    const [firstName, ...lastName] = name.split(' ');
    try {
      dispatch(
        updateUser({
          firstName,
          lastName: lastName.join(' '), // Join back in case there are middle names
          email,
          linkedInId: linkedIn,
        }),
      ).unwrap();
      setEditable(false); // Turn off edit mode
      showSuccess('Profile Updated Successfully');
    } catch (error) {
      showError('Profile Update Failed to Save. Please try again later');
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setInputErrors({
      currentPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    });
    showSuccess('Password successfully changed');
    if (currentPassword === newPassword) {
      setPasswordError("Your new password can't be the same as your old password");
      setInputErrors({
        currentPassword: true,
        newPassword: true,
        confirmNewPassword: false,
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('The new passwords do not match');
      setInputErrors({
        currentPassword: false,
        newPassword: true,
        confirmNewPassword: true,
      });
      return;
    }

    // Dispatch action to update password here
    // This is a placeholder, you'll need to adjust based on your actual implementation
    try {
      await dispatch(updatePassword({ currentPassword, newPassword })).unwrap();
      showSuccess('Password successfully changed');
      return;
    } catch (error: unknown) {
      const typedError = error as ErrorDto;
      if (typedError.statusCode === 401) {
        setPasswordError('The current password is incorrect');
        setInputErrors({
          currentPassword: true,
          newPassword: false,
          confirmNewPassword: false,
        });
        return;
      } else {
        showError('Password Change Failed. Please try again later');
      }
    }
  };

  return (
    <Bubble p={8} boxShadow="md" borderRadius="lg">
      <HStack spacing={10}>
        <Box alignSelf="start" w={64}>
          {/* Add this Box to align VStack to start */}
          <VStack alignItems="flex-start" spacing={4}>
            <Button
              w="full"
              variant="ghost"
              leftIcon={<FiUser />}
              justifyContent="flex-start"
              onClick={() => setProfileTab(true)}
              isActive={profileTab}
            >
              Profile
            </Button>
            <Button
              w="full"
              variant="ghost"
              leftIcon={<FiLock />}
              justifyContent="flex-start"
              onClick={() => setProfileTab(false)}
              isActive={!profileTab}
            >
              Security
            </Button>
          </VStack>
        </Box>

        <Box borderWidth="1px" borderRadius="lg" p={6} w="full">
          {profileTab ? (
            <>
              <HStack justifyContent="space-between" mb={6}>
                <Text fontSize="xl" fontWeight="bold">
                  Profile details
                </Text>
                {editable ? (
                  <Flex>
                    <IconButton
                      aria-label="save-profile"
                      icon={<FiSave />}
                      size="sm"
                      variant="solid"
                      colorScheme="teal"
                      onClick={handleSave}
                      mr={2}
                    />
                    <IconButton
                      aria-label="cancel"
                      icon={<SmallCloseIcon />}
                      size="sm"
                      variant="solid"
                      colorScheme="red"
                      onClick={() => setEditable(false)}
                    />
                  </Flex>
                ) : (
                  <IconButton
                    aria-label="edit-profile"
                    icon={<FiEdit2 />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditable(true)}
                  />
                )}
              </HStack>
              <VStack alignItems="flex-start" spacing={4}>
                <HStack>
                  <CustomAvatar name={auth.firstName + ' ' + auth.lastName} />
                  <VStack alignItems="flex-start" spacing={0}>
                    {editable ? (
                      <Input defaultValue={name} onChange={(e) => setName(e.target.value)} />
                    ) : (
                      <Text fontWeight="medium">{name}</Text>
                    )}
                    <Text color="gray.500" fontSize="sm">
                      Free Tier Membership
                    </Text>
                  </VStack>
                </HStack>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <FiMail />
                    </InputLeftAddon>
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      value={email}
                      isDisabled={!editable}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl id="connected-accounts">
                  <FormLabel>Connected accounts</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <FiLink />
                    </InputLeftAddon>
                    <Input type="text" placeholder="LinkedIn" isDisabled={!editable} />
                    {editable && (
                      <InputRightElement>
                        <Icon as={PlusSquareIcon} color="green.500" />
                      </InputRightElement>
                    )}
                  </InputGroup>
                </FormControl>
                <Divider />
                <Text color="gray.500" fontSize="sm">
                  {`Found your dream job? No longer need InterviewAce? :(`}
                </Text>
                <Button colorScheme="red" onClick={onOpenDeleteAccount}>
                  Delete Account
                </Button>
              </VStack>
            </>
          ) : (
            <>
              <HStack justifyContent="space-between" mb={6}>
                <Text fontSize="xl" fontWeight="bold">
                  Security and Data details
                </Text>
              </HStack>
              <VStack alignItems="flex-start" spacing={4}>
                <FormControl id="current-password">
                  <FormLabel>Current password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    isInvalid={inputErrors['currentPassword']}
                  />
                </FormControl>
                <FormControl id="new-password">
                  <FormLabel>New password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    isInvalid={inputErrors['newPassword']}
                  />
                </FormControl>
                <FormControl id="confirm-new-password">
                  <FormLabel>Confirm new password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    isInvalid={inputErrors['confirmNewPassword']}
                  />
                </FormControl>
                {passwordError && (
                  <Text fontSize="sm" fontWeight="bold" color="red.500">
                    {passwordError}
                  </Text>
                )}
                <Button colorScheme="teal" onClick={handleChangePassword}>
                  Change Password
                </Button>
                <Divider />
                <Text color="gray.500" fontSize="sm">
                  {`Want to start a refresh and delete your job, interview and responses data?`}
                </Text>
                <Button colorScheme="red" onClick={onOpenDeleteData}>
                  Delete Data
                </Button>
              </VStack>
            </>
          )}
        </Box>
      </HStack>
      <ConfirmDeleteModal
        isOpen={isDeleteAccountOpen}
        onClose={onCloseDeleteAccount}
        onDelete={() => {
          // Check if job?.id is not undefined
          try {
            dispatch(deleteUser()).unwrap();
            showSuccess('Account Deleted Successfully');
          } catch (error) {
            showError('Account Deletion Failed. Please try again later');
          }
        }}
        itemType={'account'}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteDataOpen}
        onClose={onCloseDeleteData}
        onDelete={() => {
          // Check if job?.id is not undefined
          try {
            dispatch(deleteData()).unwrap();
            showSuccess('Data Deleted Successfully');
          } catch (error) {
            showError('Data Deletion Failed. Please try again later');
          }
        }}
        itemType={'data'}
      />
    </Bubble>
  );
};

export default AccountProfile;
