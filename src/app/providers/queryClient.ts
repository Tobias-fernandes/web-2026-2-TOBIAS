import { QueryClient } from '@tanstack/react-query'
import { DEFAULT_RETRY_COUNT, DEFAULT_STALE_TIME_MS } from '@/queries'

/**
 * Single QueryClient for the app.
 *
 * Created outside the component tree so a Strict Mode remount does not throw the
 * cache away, and so tests can import the same instance.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME_MS,
      retry: DEFAULT_RETRY_COUNT,
      refetchOnWindowFocus: false,
    },
  },
})
