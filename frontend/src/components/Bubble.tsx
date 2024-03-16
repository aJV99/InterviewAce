import * as React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

// interface BubbleProps {
//   children: React.ReactNode;
//   width?: string;
// }

const Bubble: React.FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box
      bg="#f7fafc"
      p={5}
      m={1}
      boxShadow="md"
      borderRadius="xl"
      shadow="md"
      borderWidth="1px"
      flex="none"
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Bubble;
