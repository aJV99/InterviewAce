import { ChakraProvider } from '@chakra-ui/react';
import './globals.css';
import type { Metadata } from 'next';
import theme from './theme';
import Providers from '@/redux/providers';

export const metadata: Metadata = {
  title: 'InterviewAce',
  description: 'Your Personal Interview Coach',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ChakraProvider theme={theme}>
          <Providers>{children}</Providers>
        </ChakraProvider>
      </body>
    </html>
  );
}
