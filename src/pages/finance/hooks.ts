import { useState } from 'react'
import { useFormDialog } from '@/components/ui'
import { can } from '@/domain/access'
import { todayIso } from '@/lib/date'
import { useNameLookup } from '@/lib/hooks'
import { parseMoneyInput } from '@/lib/money'
import { zodValidate } from '@/lib/validation'
import {
  useActiveCycle,
  useCashFlow,
  useClients,
  useCreateFinanceEntry,
  useFinanceEntries,
  useMembers,
  useProjects,
  useSettleFinanceEntry,
} from '@/queries'
import { useCurrentUser } from '@/stores/auth'
import { toast, toastMutationError } from '@/stores/toast'
import { buildEmptyFinanceForm, EMPTY_FINANCE_FILTER } from './constants'
import { financeFormSchema } from './schemas'
import type { FinanceFilterState, FinancePageState } from './types'

export function useFinancePage(): FinancePageState {
  const user = useCurrentUser()
  const { cycle } = useActiveCycle()
  const today = todayIso()

  const [filter, setFilter] = useState<FinanceFilterState>(EMPTY_FINANCE_FILTER)

  const projects = useProjects()
  const clients = useClients()
  const members = useMembers()
  const settle = useSettleFinanceEntry()

  const entries = useFinanceEntries(cycle?.id, {
    kind: filter.kind || undefined,
    settlement: filter.settlement || undefined,
  })

  const dialog = useFormDialog({
    initial: buildEmptyFinanceForm,
    mutation: useCreateFinanceEntry(),
    validate: (form) => zodValidate(financeFormSchema, form),
    toInput: (form) => ({
      cycleId: cycle?.id ?? '',
      kind: form.kind,
      category: form.category,
      description: form.description.trim(),
      amountCents: parseMoneyInput(form.amount) ?? 0,
      dueAt: form.dueAt,
      // One date, not two: for something that already happened, the day it was
      // due and the day it moved are the same day.
      paidAt: form.settled ? form.dueAt : null,
      projectId: form.projectId || null,
      clientId: form.clientId || null,
      memberId: form.memberId || null,
      receiptRef: form.receiptRef.trim(),
      directorate: form.directorate,
      createdBy: user?.memberId ?? null,
    }),
    successMessage: () => 'Lançamento registrado.',
  })

  return {
    editable: can(user, 'finance:manage'),
    today,
    filter,
    setFilter,
    clearFilter: () => setFilter(EMPTY_FINANCE_FILTER),
    cashFlow: useCashFlow({ cycleId: cycle?.id }),
    entries,
    rows: [...(entries.data ?? [])].sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
    projects: projects.data ?? [],
    clients: clients.data ?? [],
    members: members.data ?? [],
    memberName: useNameLookup(members.data),
    settling: settle.isPending,
    toggleSettlement: (entry) => {
      const settling = !entry.paidAt
      settle.mutate(
        { id: entry.id, paidAt: settling ? today : null },
        {
          onSuccess: () =>
            toast.success(
              settling
                ? `${entry.description}: marcado como pago.`
                : `${entry.description}: pagamento desfeito.`,
            ),
          onError: (cause) => toastMutationError(cause),
        },
      )
    },
    dialog,
  }
}
