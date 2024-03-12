'use client';
import withAuth from '@/redux/features/authHoc';
import Login from '@/pages/LoginPage';

const LoginPage = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default withAuth(LoginPage);
