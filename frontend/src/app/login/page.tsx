'use client';
import withAuth from '@/redux/features/authHoc';
import Login from '@/appPages/LoginPage';
import MobileAccessBlocker from '@/components/MobileAccessBlocker';

const LoginPage = () => {
  return (
    <>
      <MobileAccessBlocker>
        <Login />
      </MobileAccessBlocker>
    </>
  );
};

export default withAuth(LoginPage);
