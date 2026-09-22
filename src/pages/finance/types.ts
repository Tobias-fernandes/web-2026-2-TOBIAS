import type { FormDialogState, Loadable } from '@/components/ui'
import type {
  CashFlowSummary,
  Client,
  Directorate,
  FinanceCategory,
  FinanceEntry,
  FinanceKind,
  Member,
  Project,
} from '@/domain/types'

export interface FinanceFormState {
  kind: FinanceKind
  category: FinanceCategory
  description: string
  /** Typed in reais and converted to cents on submit. */
  amount: string
  dueAt: string
  /**
   * The money already moved. A coffee break bought last Tuesday is one entry,
   * not an entry plus a second trip to settle it.
   */
  settled: boolean
  directorate: Directorate
  /** Who paid out of pocket, or received on the EJ's behalf. Optional. */
  memberId: string
  /** Nota fiscal, recibo ou link do comprovante. Optional. */
  receiptRef: string
  projectId: string
  clientId: string
}

export interface FinanceFilterState {
  kind: '' | FinanceKind
  settlement: '' | 'open' | 'settled' | 'overdue'
}

export interface FinancePageState {
  editable: boolean
  today: string
  filter: FinanceFilterState
  setFilter: (filter: FinanceFilterState) => void
  clearFilter: () => void
  cashFlow: Loadable<CashFlowSummary>
  entries: Loadable<FinanceEntry[]>
  /** The ledger by due date, which is the order money actually moves in. */
  rows: FinanceEntry[]
  projects: Project[]
  clients: Client[]
  members: Member[]
  memberName: (id: string) => string
  settling: boolean
  /** Marks a line paid today, or reopens it when the date is cleared. */
  toggleSettlement: (entry: FinanceEntry) => void
  dialog: FormDialogState<FinanceFormState>
}
