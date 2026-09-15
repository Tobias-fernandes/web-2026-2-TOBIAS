import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '@/components/ui'
import { useCurrentUser, useIsRestoringSession } from '@/stores/auth'

/** Guards the `/app` routes, returning the user to their destination after login. */
export function RequireAuth() {
  const user = useCurrentUser()
  const isRestoring = useIsRestoringSession()
  const location = useLocation()

  if (isRestoring) {
    return (
      <div className="grid min-h-dvh place-items-center bg-papel">
        <Spinner label="Restaurando sessão…" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
