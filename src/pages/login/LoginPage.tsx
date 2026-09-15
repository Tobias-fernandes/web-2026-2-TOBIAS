import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { DEMO_PASSWORD, DEMO_USERS } from '@/auth/services'
import { Brand } from '@/components/layout'
import { Button, TextField } from '@/components/ui'
import { isUsingMockData } from '@/config/env'
import { MEMBER_ROLE_LABELS } from '@/domain/constants'
import {
  useCurrentUser,
  useIsRestoringSession,
  useSignIn,
} from '@/stores/auth'
import { DEFAULT_REDIRECT, EMPTY_LOGIN_FORM } from './constants'
import type { LocationStateWithRedirect, LoginFormState } from './types'

export function LoginPage() {
  const user = useCurrentUser()
  const isRestoring = useIsRestoringSession()
  const signIn = useSignIn()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState<LoginFormState>(EMPTY_LOGIN_FORM)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const redirectTo =
    (location.state as LocationStateWithRedirect | null)?.from ?? DEFAULT_REDIRECT

  if (!isRestoring && user) return <Navigate to={redirectTo} replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await signIn(form)
      navigate(redirectTo, { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível entrar.')
    } finally {
      setSubmitting(false)
    }
  }

  function fillDemoUser(email: string) {
    setForm({ email, password: DEMO_PASSWORD })
    setError(null)
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-papel px-5 py-10">
      <div className="w-full max-w-[420px]">
        <Brand to="/" className="mb-7 justify-center" />

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-linha bg-papel-alto p-6"
        >
          <h1 className="font-display text-xl font-bold">Acessar o sistema</h1>
          <p className="mt-1 mb-5 text-[0.92rem] text-tinta-suave">
            Entre com o e-mail da sua empresa júnior.
          </p>

          <div className="flex flex-col gap-4">
            <TextField
              label="E-mail"
              type="email"
              name="email"
              autoComplete="username"
              required
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder="voce@suaej.com.br"
            />
            <TextField
              label="Senha"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              error={error ?? undefined}
            />
          </div>

          <Button type="submit" className="mt-5 w-full" disabled={submitting}>
            {submitting ? 'Entrando…' : 'Entrar'}
          </Button>

          <p className="mt-4 mb-0 text-center text-[0.86rem]">
            <Link to="/" className="text-tinta-suave no-underline hover:text-violeta">
              Voltar para a página inicial
            </Link>
          </p>
        </form>

        {isUsingMockData && (
          <div className="mt-5 rounded-lg border border-dashed border-linha bg-papel-alto p-4">
            <p className="mb-3 text-[0.82rem] font-semibold text-tinta">
              Acessos de demonstração
            </p>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {DEMO_USERS.map((demoUser) => (
                <li key={demoUser.id}>
                  <button
                    type="button"
                    onClick={() => fillDemoUser(demoUser.email)}
                    className="flex w-full items-baseline justify-between gap-3 rounded-[4px] border border-linha px-3 py-2 text-left text-[0.82rem] hover:border-violeta hover:text-violeta"
                  >
                    <span>{demoUser.email}</span>
                    <span className="shrink-0 text-tinta-suave">
                      {MEMBER_ROLE_LABELS[demoUser.role]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 mb-0 text-[0.78rem] text-tinta-suave">
              Senha para todos:{' '}
              <code className="rounded bg-papel px-1">{DEMO_PASSWORD}</code>. A
              autenticação real entra pelo Amazon Cognito, sem mudar as telas.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
