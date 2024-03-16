import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import useAnimatedRouter from '@/components/useAnimatedRouter';

interface AnimatedButtonProps extends Omit<ButtonProps, 'onClick'> {
  destination: string;
}

// Use React.forwardRef to forward refs to the underlying Button component
const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ destination, children, ...rest }, ref) => {
    const router = useAnimatedRouter(); // Using the custom hook

    const handleClick = () => {
      router.animatedRoute(destination); // Navigate using the custom animated route method
    };

    // Pass the ref along with other props to the Button component
    return (
      <Button ref={ref} onClick={handleClick} {...rest}>
        {children}
      </Button>
    );
  },
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
