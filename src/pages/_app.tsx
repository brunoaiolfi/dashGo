import React from 'react';
import { AppProps } from 'next/app'
import { ChakraProvider, useBreakpointValue } from '@chakra-ui/react'
import { theme } from '../styles/theme';
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext';
import { makeServer } from '../services/mirageApi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider } from '../contexts/AuthContext';
function MyApp({ Component, pageProps }: AppProps) {

  // if (process.env.NODE_ENV === 'development') {
  //   makeServer()
  // }

  const queryClient = new QueryClient()
  return (
    <ChakraProvider resetCSS={true} theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SidebarDrawerProvider>
            <Component {...pageProps} />
          </SidebarDrawerProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default MyApp
