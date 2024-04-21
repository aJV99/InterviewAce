import { CheckIcon, CloseIcon, SmallCloseIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
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
  useDisclosure,
  Flex,
  Divider,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FiUser, FiLock, FiEdit2, FiMail, FiSave } from 'react-icons/fi';
import CustomAvatar from '@/components/CustomAvatar';
import Bubble from '@/components/Bubble';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { deleteUser, getUser, updatePassword, updateUser } from '@/redux/features/authSlice';
import { deleteData } from '@/redux/features/jobSlice';
import { useCustomToast } from '@/components/Toast';
import { ErrorDto } from '@/app/error';

const AccountProfile: React.FC = () => {
  const [profileTab, setProfileTab] = useState<boolean>(true);
  const [editable, setEditable] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
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
  // const [linkedIn, setLinkedIn] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [inputErrors, setInputErrors] = useState({
    email: false,
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [hasValidLength, setHasValidLength] = useState(false);
  const { showSuccess, showError } = useCustomToast();

  useEffect(() => {
    if (auth.user) {
      setName(auth.firstName + ' ' + auth.lastName);
      setEmail(auth.user.email);
      // setLinkedIn(auth.user.linkedInId || '');
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
    let firstName;
    let lastName = '';
    let middleNameList;

    if (name === '') {
      // If no name is given, revert to the authenticated user's name
      firstName = auth.firstName;
      lastName = auth.lastName;
      setName(auth.firstName + ' ' + auth.lastName);
    } else {
      const names = name.split(' ');
      if (names.length === 1) {
        // If only one word is given, update first name and keep last name as before
        firstName = names[0];
        lastName = auth.lastName; // Retain the original last name if only one name is input
      } else {
        // More than one name means first name and possibly middle/last names
        [firstName, ...middleNameList] = names;
        lastName = middleNameList.join(' '); // Join the rest as the last name
      }
    }

    // Exit function if there are email input errors
    if (inputErrors['email'] === true) return;

    // Try to update the user and handle possible errors
    try {
      dispatch(
        updateUser({
          firstName,
          lastName,
          email,
          // linkedInId: linkedIn,
        }),
      ).unwrap();

      setEditable(false); // Turn off edit mode
      showSuccess('Profile Updated Successfully');
    } catch (error) {
      showError('Profile Update Failed to Save. Please try again later');
    }
  };

  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    setHasLowercase(/[a-z]/.test(password));
    setHasUppercase(/[A-Z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSymbol(/[^A-Za-z0-9]/.test(password));
    setHasValidLength(password.length >= 8);
    validatePassword();
  };

  const validateEmail = (emailParam: string) => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailParam);
    setInputErrors({
      ...inputErrors,
      email: !valid,
    });
    return valid;
  };

  const validatePassword = () => {
    const isValid = hasLowercase && hasUppercase && hasNumber && hasSymbol && hasValidLength;
    setInputErrors({
      ...inputErrors,
      newPassword: !isValid,
      confirmNewPassword: newPassword === confirmNewPassword,
    });
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validatePassword() || newPassword !== confirmNewPassword) {
      setPasswordError(
        newPassword !== confirmNewPassword ? 'The new passwords do not match' : 'Invalid new password',
      );
      return;
    }

    try {
      await dispatch(updatePassword({ currentPassword, newPassword })).unwrap();
      showSuccess('Password successfully changed');
    } catch (error: unknown) {
      const typedError = error as ErrorDto;
      showError(`Password Change Failed: ${typedError.message}`);
    }
  };

  return (
    <Bubble p={8} boxShadow="md" borderRadius="lg">
      <HStack spacing={10}>
        <Box alignSelf="start" w={64}>
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
                      isDisabled={name === '' || inputErrors.email}
                    />
                    <IconButton
                      aria-label="cancel"
                      icon={<SmallCloseIcon />}
                      size="sm"
                      variant="solid"
                      colorScheme="red"
                      onClick={() => {
                        setName(auth.firstName + ' ' + auth.lastName);
                        if (auth.user) {
                          setEmail(auth.user.email);
                        }
                        setInputErrors({
                          ...inputErrors,
                          email: false,
                        });
                        setEditable(false);
                      }}
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
                <FormControl isInvalid={inputErrors.email} id="email">
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                      }}
                      isInvalid={inputErrors.email}
                    />
                  </InputGroup>
                  <FormErrorMessage>Inputted email is invalid</FormErrorMessage>
                </FormControl>
                {/* <FormControl id="connected-accounts">
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
                </FormControl> */}
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
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      isInvalid={inputErrors['currentPassword']}
                    />
                    <InputRightElement h={'full'}>
                      <Button variant={'ghost'} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl id="new-password" isInvalid={inputErrors['newPassword']}>
                  <FormLabel>New password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                    <InputRightElement h={'full'}>
                      <Button variant={'ghost'} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Box mt="2">
                    <Text fontSize="xs" color={hasValidLength ? 'green.500' : 'red.500'}>
                      {hasValidLength ? <CheckIcon /> : <CloseIcon />} 8 or more characters
                    </Text>
                    <Text fontSize="xs" color={hasLowercase ? 'green.500' : 'red.500'}>
                      {hasLowercase ? <CheckIcon /> : <CloseIcon />} Lowercase letter (a-z)
                    </Text>
                    <Text fontSize="xs" color={hasUppercase ? 'green.500' : 'red.500'}>
                      {hasUppercase ? <CheckIcon /> : <CloseIcon />} Uppercase letter (A-Z)
                    </Text>
                    <Text fontSize="xs" color={hasNumber ? 'green.500' : 'red.500'}>
                      {hasNumber ? <CheckIcon /> : <CloseIcon />} A number (0-9)
                    </Text>
                    <Text fontSize="xs" color={hasSymbol ? 'green.500' : 'red.500'}>
                      {hasSymbol ? <CheckIcon /> : <CloseIcon />} A symbol (!@#$...)
                    </Text>
                  </Box>
                </FormControl>

                <FormControl id="confirm-new-password">
                  <FormLabel>Confirm new password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      isInvalid={confirmNewPassword !== newPassword}
                    />
                    <InputRightElement h={'full'}>
                      <Button variant={'ghost'} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
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
