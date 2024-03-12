'use client';
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: "'IBM Plex Sans', sans-serif",
    // body: "'Roboto Flex', sans-serif",
    // body: "'Palanquin', sans-serif",
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: '600',
      },
    },
  },
});

export default theme;
