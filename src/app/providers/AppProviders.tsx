import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { SessionLoader } from '@/auth/components'
import { queryClient } from './queryClient'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionLoader>{children}</SessionLoader>
    </QueryClientProvider>
  )
}
