import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '@/stores/auth'

/**
 * Reads the persisted session once, on app start-up.
 *
 * Lives in a component rather than at module scope so the restore runs inside
 * React's lifecycle and Strict Mode's double effect is harmless — `restore` is
 * idempotent.
 */
export function SessionLoader({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useAuthStore.getState().restore()
  }, [])

  return <>{children}</>
}
