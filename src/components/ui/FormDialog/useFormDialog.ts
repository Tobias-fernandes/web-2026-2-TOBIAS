import { useState } from 'react'
import type { ID } from '@/domain/types'
import { toast } from '@/stores/toast'

const FALLBACK_ERROR = 'Não foi possível salvar.'

/**
 * The slice of a mutation this hook needs.
 *
 * Declared structurally rather than imported from React Query, so the component
 * layer keeps knowing nothing about the data layer.
 */
interface Submitter<TInput> {
  mutateAsync: (input: TInput) => Promise<unknown>
  isPending: boolean
}

interface FormDialogOptions<TForm, TInput> {
  /** Called on every open, so the dialog always starts from a clean form. */
  initial: () => TForm
  mutation: Submitter<TInput>
  /**
   * Message to show instead of submitting, or null when the form is valid.
   * Gets `editing` for the same reason `toInput` does: a rule that checks the
   * form against the record's siblings (no two of the same year, say) has to
   * know which one, if any, is the record being changed, so it does not flag
   * a record against itself.
   */
  validate?: (form: TForm, editing: ID | null) => string | null
  /** `editing` is the record's id when the dialog was opened to change one. */
  toInput: (form: TForm, editing: ID | null) => TInput
  /**
   * Toast shown after a successful save. Told apart by `editing` because
   * "cadastrado" and "atualizado" are different claims — closing the dialog
   * is the only feedback a save otherwise gets. Omit to stay silent.
   */
  successMessage?: (editing: ID | null) => string
}

export interface FormDialogState<TForm> {
  open: boolean
  form: TForm
  error: string | null
  submitting: boolean
  /** The record being changed, or null while the dialog is creating one. */
  editing: ID | null
  setForm: (form: TForm) => void
  /** Opens on a fresh form, with `overrides` applied — defaults picked at click time. */
  openWith: (overrides?: Partial<TForm>) => void
  /** Opens on an existing record, so submitting updates instead of creating. */
  openFor: (id: ID, form: TForm) => void
  close: () => void
  submit: () => void
}

/**
 * Dialog state for writing a record: open flag, draft, validation and failure.
 *
 * Every register screen ran the same sequence by hand — reset the form, validate,
 * await the mutation, close on success, show `cause.message` on failure — and
 * each copy was one more place for the error handling to drift.
 *
 * Creating and editing are the same dialog, told apart by `editing`. A screen
 * that kept two of these ended up with two copies of the field mapping and two
 * identical dialogs in its markup, differing only in which mutation they called.
 */
export function useFormDialog<TForm extends object, TInput>({
  initial,
  mutation,
  validate,
  toInput,
  successMessage,
}: FormDialogOptions<TForm, TInput>): FormDialogState<TForm> {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<TForm>(initial)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<ID | null>(null)

  const start = (next: TForm, record: ID | null) => {
    setForm(next)
    setEditing(record)
    setError(null)
    setOpen(true)
  }

  return {
    open,
    form,
    error,
    editing,
    submitting: mutation.isPending,
    setForm,

    openWith(overrides) {
      start({ ...initial(), ...overrides }, null)
    },

    openFor(id, next) {
      start(next, id)
    },

    close() {
      setOpen(false)
    },

    async submit() {
      const invalid = validate?.(form, editing)
      if (invalid) {
        setError(invalid)
        return
      }

      setError(null)

      try {
        await mutation.mutateAsync(toInput(form, editing))
        if (successMessage) toast.success(successMessage(editing))
        setOpen(false)
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : FALLBACK_ERROR)
      }
    },
  }
}
