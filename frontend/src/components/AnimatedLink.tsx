'use client';
import React from 'react';
import useAnimatedRouter from '@/components/useAnimatedRouter';
import Link from 'next/link';
import { LinkProps } from 'next/dist/client/link';

interface AnimatedLinkProps extends React.PropsWithChildren, Omit<LinkProps, 'onClick'> {
  // You can extend or modify LinkProps as needed here
  className: string;
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({ href, children, className, ...rest }) => {
  const router = useAnimatedRouter(); // Using the custom hook

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent the default link action
    router.animatedRoute(href.toString()); // Use the custom method for animated navigation
  };

  return (
    <Link href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </Link>
  );
};

export default AnimatedLink;
