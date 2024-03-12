import { Box } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [time, setTime] = useState(0); // Track time in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate minutes and seconds from time
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Format time to ensure two digits for minutes and seconds
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return <Box ml="3">{formattedTime}</Box>;
};

export default Timer;
