import type { ClientStatus } from '@/domain/types'

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
