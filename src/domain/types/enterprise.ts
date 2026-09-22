import type { ID, IsoDate } from './common'

/**
 * The junior enterprise that contracted the system — the tenant.
 *
 * Every other record in the system belongs to one of these, directly or through
 * the cycle it happened in. Nothing crosses from one to another: a member holds
 * a position in exactly one enterprise, and the API scopes what it serves by the
 * enterprise in the caller's token, never by a parameter the client chose.
 *
 * The CNPJ is stored as digits only. Punctuation is presentation, and a document
 * that arrives once masked and once clean is the same document — storing both
 * forms is how duplicate registrations get in.
 */
export interface JuniorEnterprise {
  id: ID
  /** Nome fantasia: what the EJ calls itself, not the name on the incorporation. */
  tradeName: string
  /** 14 digits, unpunctuated. */
  cnpj: string
  /** Official address of the enterprise, not of whoever registered it. */
  email: string
  createdAt: IsoDate
}
