'use client';
import React from 'react';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const router = useRouter();
    const pathname = usePathname();

    if (!token && pathname !== '/login') {
      router.push('/login');
      return null;
    }

    if (token && pathname === '/login') {
      router.push('/dashboard');
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Set a display name for debugging purposes
  WithAuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuthComponent;
};

// Helper function to get the display name of a component
function getDisplayName<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;
