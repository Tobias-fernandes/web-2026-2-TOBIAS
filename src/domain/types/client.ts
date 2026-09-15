import type { ID } from './common'

export type ClientStatus = 'lead' | 'negotiating' | 'active' | 'closed'

export interface Client {
  id: ID
  name: string
  /** CNPJ. Null for leads that are not registered companies yet. */
  taxId: string | null
  contactName: string
  email: string
  phone: string
  segment: string
  status: ClientStatus
  notes: string
  createdAt: string
}
