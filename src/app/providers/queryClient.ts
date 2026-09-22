import { QueryClient } from '@tanstack/react-query'
import { DEFAULT_RETRY_COUNT, DEFAULT_STALE_TIME_MS } from '@/queries/constants'

/**
 * Single QueryClient for the app.
 *
 * Created outside the component tree so a Strict Mode remount does not throw the
 * cache away, and so tests can import the same instance.
 *
 * Every write in this app changes what the lists *and* the reports derive from —
 * a new time entry moves the dashboard, a new client moves the project board. So
 * invalidation is a default here instead of a pair of `invalidateQueries` calls
 * copied into each mutation, where forgetting the reports half left the numbers
 * stale with nothing to catch it. A mutation that sets its own `onSuccess`
 * replaces this default rather than adding to it.
 */
export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME_MS,
      retry: DEFAULT_RETRY_COUNT,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onSuccess: (): Promise<void> => queryClient.invalidateQueries(),
    },
  },
})
