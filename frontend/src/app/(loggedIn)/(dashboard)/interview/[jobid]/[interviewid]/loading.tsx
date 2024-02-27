"use client";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // You might want to adjust timing based on your animation
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 30000); // Duration of your wipe animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width={isAnimating ? "0%" : "100%"}
      height="100vh"
      backgroundColor={"blue"}
      zIndex="overlay"
      style={{
        transition: "width 1s ease-in-out",
      }}
    ></Box>
  );
};

export default LoadingScreen;
