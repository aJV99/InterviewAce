"use client";
import React from "react";
import useAnimatedRouter from "./useAnimatedRouter";
import { Button, ButtonProps } from "@chakra-ui/react";

// Extend ButtonProps to include only the additional props you need
interface AnimatedButtonProps extends Omit<ButtonProps, "onClick"> {
  destination: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ destination, children, ...rest }) => {
  const router = useAnimatedRouter(); // Using the custom hook

  const handleClick = () => {
    router.animatedRoute(destination); // Navigate using the custom animated route method
  };

  return (
    <Button onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
};

export default AnimatedButton;
