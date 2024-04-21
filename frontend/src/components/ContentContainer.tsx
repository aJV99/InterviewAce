import * as React from 'react';
import { Box, Spacer } from '@chakra-ui/react';
import { Footer } from '@/components/Footer';

interface ContentContainerProps {
  children: React.ReactNode;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
  return (
    <>
      <Box padding="0" bgColor="#d3deed" minHeight="90vh">
        {React.Children.map(children, (child) => (
          <Box>{child}</Box>
        ))}
        <Spacer />
      </Box>
      <Footer />
    </>
  );
};

export const Content: React.FC<ContentContainerProps> = ({ children }) => {
  return (
    <>
      {React.Children.map(children, (child) => (
        <Box mb={3} px={5}>
          {child}
        </Box>
      ))}
    </>
  );
};

export default ContentContainer;
