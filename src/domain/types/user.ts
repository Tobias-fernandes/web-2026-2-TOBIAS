import type { Directorate } from "./directorate";
import type { ID } from "./common";
import type { MemberRole } from "./membership";

/**
 * Authenticated user. Mirrors the claims expected from a Cognito id token.
 *
 * `enterpriseId` is the tenant, and it is a claim rather than something the
 * client picks: it is written onto the Cognito user by the backend at sign-up
 * and at invitation, both of which need AWS credentials the browser must never
 * hold. Were the client able to state its own tenant, changing one field would
 * be enough to read another EJ's books.
 *
 * `role` and `directorate`, by contrast, are not claims. They change at every
 * handover and a token outlives that, so they are resolved from the member's
 * membership in the open cycle each time a session starts — otherwise a former
 * finance director would keep the ledger until their token expired.
 */
export interface User {
  id: ID;
  enterpriseId: ID;
  name: string;
  email: string;
  /** Position in the current term; the claim the permission rules read. */
  role: MemberRole;
  directorate: Directorate;
  /** Picture URL, when the identity provider has one — Cognito's `picture` claim. */
  avatarUrl: string | null;
  memberId: ID | null;
}

export interface Session {
  user: User;
  /** Sent as the Authorization bearer token on every API call. */
  accessToken: string;
  expiresAt: number;
}
