import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import type { NewPasswordChallenge } from '@/auth/services'
import { Brand } from '@/components/layout'
import { CloseIcon } from '@/components/ui/icons'
import { ROUTES } from '@/config/routes'
import { useCurrentUser, useIsRestoringSession } from '@/stores/auth'
import { AuthModeToggle } from './AuthModeToggle'
import { CredentialsForm } from './CredentialsForm'
import { DEFAULT_REDIRECT } from './constants'
import { NewPasswordForm } from './NewPasswordForm'
import type { LocationStateWithRedirect } from './types'

/**
 * Sign-in.
 *
 * Deliberately the barest screen in the product: a wordmark and one of two
 * short forms, with no card around them. Nothing here is a decision the
 * reader makes — they already decided when they clicked "acessar" — so
 * anything competing with the fields is in the way.
 *
 * The two forms are `CredentialsForm` and `NewPasswordForm`, picked by
 * whether a challenge is pending — this shell owns only that switch and the
 * chrome both share.
 */
export function LoginPage() {
  const user = useCurrentUser()
  const isRestoring = useIsRestoringSession()
  const location = useLocation()

  const [challenge, setChallenge] = useState<NewPasswordChallenge | null>(null)

  const redirectTo =
    (location.state as LocationStateWithRedirect | null)?.from ?? DEFAULT_REDIRECT

  if (!isRestoring && user) return <Navigate to={redirectTo} replace />

  return (
    <div className="relative grid min-h-dvh place-items-center bg-papel px-6 py-16">
      <Link
        to={ROUTES.landing}
        aria-label="Voltar para a página inicial"
        className="absolute top-5 right-5 rounded-md p-2 text-tinta-suave no-underline hover:bg-papel-alto hover:text-tinta"
      >
        <CloseIcon size={20} />
      </Link>

      <div className="w-full max-w-90">
        <Brand to={ROUTES.landing} className="justify-center" />

        {/*
          Dev-only, stripped from production builds — `import.meta.env.DEV` is
          statically `false` there. Hidden mid-challenge: switching backends
          while a Cognito password change is pending would abandon it.
        */}
        {import.meta.env.DEV && !challenge && (
          <div className="mt-9">
            <AuthModeToggle />
          </div>
        )}

        {challenge ? (
          <NewPasswordForm challenge={challenge} redirectTo={redirectTo} />
        ) : (
          <CredentialsForm redirectTo={redirectTo} onChallenge={setChallenge} />
        )}
      </div>
    </div>
  )
}
