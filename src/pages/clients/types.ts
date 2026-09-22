import type { FormDialogState, Loadable } from '@/components/ui'
import type { Client, ClientStatus } from '@/domain/types'

export interface ClientFormState {
  name: string
  taxId: string
  contactName: string
  email: string
  phone: string
  segment: string
  status: ClientStatus
  notes: string
}

export interface ClientsPageState {
  clients: Loadable<Client[]>
  /** Matching the search, which the page only has to render. */
  rows: Client[]
  search: string
  setSearch: (term: string) => void
  searching: boolean
  projectCount: (clientId: string) => number
  updating: boolean
  changeStatus: (client: Client, status: ClientStatus) => void
  dialog: FormDialogState<ClientFormState>
}
