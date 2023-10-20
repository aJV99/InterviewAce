import { ChakraProvider } from '@chakra-ui/react'
import './globals.css'
import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import theme from "./theme";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <ChakraProvider theme={theme}>
        {children}
        </ChakraProvider>
      </body>
      
    </html>
  )
}
