import React from 'react';
import { AppProps } from 'next/app'
import { ChakraProvider, useBreakpointValue } from '@chakra-ui/react'
import { theme } from '../styles/theme';
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider } from '../contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider resetCSS={true} theme={theme} >
        <AuthProvider>
          <SidebarDrawerProvider>
            <ToastContainer
              theme="dark"
            />

            <Component {...pageProps} />

          </SidebarDrawerProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default MyApp
