import type { AcademicTerm, ID, IsoDate } from "./common";

/**
 * Where a person is in the enterprise.
 *
 * `invited` is the gap between the board registering someone and that person
 * confirming it: the record is already complete — the president filled it in —
 * but nobody has accepted it yet, so it counts for no report and grants no
 * access. Accepting moves it to `active`; the other two are what happens after.
 */
export type MemberStatus = "invited" | "active" | "onLeave" | "inactive";

/**
 * A person, across every term they took part in.
 *
 * Deliberately carries no position and no weekly load: those change at each
 * handover and live in `Membership`. What stays here is what does not change —
 * who the person is, where they study, and when they joined the enterprise.
 *
 * CPF is stored as digits only, for the same reason the CNPJ is: a document
 * typed once with punctuation and once without is one person, and keeping both
 * forms is how the same student gets admitted twice.
 */
export interface Member {
  id: ID;
  enterpriseId: ID;
  name: string;
  email: string;
  phone: string;
  /** 11 digits, unpunctuated. */
  cpf: string;
  /** Enrolment number at the university. */
  registration: string;
  /** The term the person started the degree in, as `2023.1`. */
  entryTerm: AcademicTerm;
  courseId: ID;
  /** Optional: the system never blocks an admission for a missing picture. */
  avatarUrl: string | null;
  status: MemberStatus;
  joinedAt: IsoDate;
  /** Filled when the person leaves; keeps the history of past terms intact. */
  leftAt: IsoDate | null;
  createdAt: IsoDate;
}
