// import { Providers } from "@/redux/provider";
import { ChakraProvider } from "@chakra-ui/react";
import "./globals.css";
import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import theme from "./theme";
import store from "../redux/store";
import Providers from "../redux/providers";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "InterviewAce",
  description: "Your Personal Interview Coach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          <Providers>{children}</Providers>
        </ChakraProvider>
      </body>
    </html>
  );
}
