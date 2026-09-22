import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { NewPasswordChallenge } from '@/auth/services'
import { Button, ErrorText, TextField } from '@/components/ui'
import { MIN_PASSWORD_LENGTH, validateNewPassword } from '@/lib/password'
import { useCompleteNewPassword } from '@/stores/auth'
import { toast } from '@/stores/toast'
import { EMPTY_NEW_PASSWORD_FORM } from './constants'
import type { NewPasswordFormState } from './types'

interface NewPasswordFormProps {
  challenge: NewPasswordChallenge
  redirectTo: string
}

/**
 * The forced first sign-in for an account an administrator created.
 *
 * The credentials on the previous screen were correct — Cognito is pausing
 * mid-way, not refusing them — so this replaces that form rather than
 * reporting an error on it.
 */
export function NewPasswordForm({ challenge, redirectTo }: NewPasswordFormProps) {
  const completeNewPassword = useCompleteNewPassword()
  const navigate = useNavigate()

  const [form, setForm] = useState<NewPasswordFormState>(EMPTY_NEW_PASSWORD_FORM)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const complaint = validateNewPassword(form.password, form.confirmation)
    if (complaint) {
      setError(complaint)
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await completeNewPassword(challenge, form.password)
      toast.success('Senha definida.')
      navigate(redirectTo, { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível definir a senha.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1 className="mt-9 mb-1.5 text-center font-display text-xl font-bold">
        Defina sua senha
      </h1>
      <p className="mt-0 mb-8 text-center text-base text-tinta-suave">
        Sua conta foi criada pela presidência da sua EJ. Escolha uma senha
        definitiva para continuar.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          label="Nova senha"
          type="password"
          name="new-password"
          autoComplete="new-password"
          hint={`Ao menos ${MIN_PASSWORD_LENGTH} caracteres.`}
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <TextField
          label="Repita a senha"
          type="password"
          name="new-password-confirmation"
          autoComplete="new-password"
          value={form.confirmation}
          onChange={(event) => setForm({ ...form, confirmation: event.target.value })}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <Button type="submit" className="mt-1 w-full" disabled={submitting}>
          {submitting ? 'Salvando…' : 'Definir senha e entrar'}
        </Button>
      </form>
    </>
  )
}
