import type { Directorate } from "@/domain/types";
import type { CycleGoalsFormState } from "@/lib/cycleGoals";

export interface WorkAreaDraft {
  name: string;
  /**
   * The functions that grant permissions; the name above is the EJ's own. More
   * than one when the EJ merges areas, as in "Comercial e Marketing".
   */
  directorates: Directorate[];
}

export interface PresidentDraft {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  registration: string;
  entryTerm: string;
  /** Names, not ids: neither the course nor the area exists yet. */
  course: string;
  workArea: string;
  avatarUrl: string | null;
  password: string;
  passwordConfirmation: string;
}

/** Whether the management is already running, and where it stands if it is. */
export interface CycleStartDraft {
  /** Null until the president answers — neither answer is assumed. */
  ongoing: boolean | null;
  /** The day the board took office. */
  startsAt: string;
  /** Money in the account today, in reais as typed. */
  balance: string;
  /** Contract value of the projects already delivered this management. */
  contractedRevenue: string;
  deliveredProjects: string;
}

export interface SignUpFormState {
  tradeName: string;
  cnpj: string;
  email: string;
  courses: string[];
  workAreas: WorkAreaDraft[];
  cycleStart: CycleStartDraft;
  /** Targets for the first management, opened the moment the EJ registers. */
  goals: CycleGoalsFormState;
  president: PresidentDraft;
}

/** What a step may ask beyond the form itself — the questions only the server can answer. */
export interface SignUpChecks {
  isCnpjTaken: (cnpj: string) => Promise<boolean>;
}

/**
 * Each step validates only what it asked for, so nobody is sent back twice.
 * A step may answer later than synchronously when it has to ask the server.
 */
export interface SignUpStep {
  id: "enterprise" | "courses" | "areas" | "cycleStart" | "goals" | "president";
  title: string;
  description: string;
  validate: (
    form: SignUpFormState,
    checks: SignUpChecks,
  ) => string | null | Promise<string | null>;
}
