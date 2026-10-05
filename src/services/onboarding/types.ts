import type {
  AcademicTerm,
  CycleGoals,
  CycleStartingPoint,
  Directorate,
  IsoDate,
  Session,
} from "@/domain/types";

/**
 * Everything it takes to put a junior enterprise into the system, in one call.
 *
 * One payload rather than a sequence of requests because the parts are useless
 * apart: an enterprise with no president has nobody who can sign in, and a
 * president with no cycle holds a position in a term that does not exist. The
 * backend writes all of it in a transaction, or none of it.
 *
 * The president names their course and area instead of pointing at ids, because
 * neither exists yet — both are being created by this same call. The service
 * resolves the names once the records have ids.
 */
export interface SignUpInput {
  enterprise: {
    tradeName: string;
    /** Digits only; the form strips the mask before sending. */
    cnpj: string;
    email: string;
  };
  /** Names of the degree courses this EJ admits from. At least one. */
  courses: string[];
  /**
   * The EJ's own areas, each mapped to the functions that grant permissions —
   * one or several, and no function in two areas.
   */
  workAreas: { name: string; directorates: Directorate[] }[];
  /** Targets for the first management, which opens the moment the EJ registers. */
  cycleGoals: CycleGoals;
  /**
   * Set when the EJ adopts the system with its management already running:
   * the day the board took office and where it stands today. Null when the
   * management starts now, together with the system.
   */
  ongoingCycle:
    ({ startsAt: IsoDate } & Omit<CycleStartingPoint, "recordedAt">) | null;
  president: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    registration: string;
    entryTerm: AcademicTerm;
    avatarUrl: string | null;
    /** One of `courses`. */
    course: string;
    /** One of `workAreas`. */
    workArea: string;
    password: string;
  };
}

/**
 * Registering a junior enterprise.
 *
 * Kept out of `DataLayer` because it is the one operation that runs with nobody
 * signed in: every other call is scoped by the tenant in the caller's token,
 * and this is the call that creates the tenant the token will point at.
 */
export interface OnboardingService {
  /**
   * Creates the enterprise, its courses and areas, its first cycle and its
   * president, and returns the session that president signs in with.
   *
   * Against Cognito the session will not come back from this call — the account
   * has to confirm its e-mail first — so the screen treats the session as
   * optional and falls back to sending the president to the login page.
   */
  signUp(input: SignUpInput): Promise<Session | null>;

  /** Whether a CNPJ is already registered. Asked while the form is filled. */
  isCnpjTaken(cnpj: string): Promise<boolean>;
}
