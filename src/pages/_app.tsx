import React from 'react';
import { AppProps } from 'next/app'
import { ChakraProvider, useBreakpointValue } from '@chakra-ui/react'
import { theme } from '../styles/theme';
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext';
import { makeServer } from '../services/mirageApi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
function MyApp({ Component, pageProps }: AppProps) {

  if (process.env.NODE_ENV === 'development') {
    makeServer()
  }

  const queryClient = new QueryClient()
  return (
    <ChakraProvider resetCSS={true} theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SidebarDrawerProvider>
          <Component {...pageProps} />
        </SidebarDrawerProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default MyApp
