'use client';
import SignUpPage from '@/appPages/SignupPage';
import MobileAccessBlocker from '@/components/MobileAccessBlocker';

const SignUp = () => {
  return (
    <>
      <MobileAccessBlocker>
        <SignUpPage />
      </MobileAccessBlocker>
    </>
  );
};

export default SignUp;
