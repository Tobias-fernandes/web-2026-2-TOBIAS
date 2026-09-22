import type { MemberRole } from "@/domain/types";
import { addDays, todayIso } from "@/lib/date";
import type { AllocationFormState } from "./types";

export const buildEmptyAllocationForm = (): AllocationFormState => ({
  memberId: "",
  projectId: "",
  weeklyHours: "4",
  startsAt: todayIso(),
  endsAt: addDays(todayIso(), 60),
});

export const CAPACITY_TABLE_HEADERS = [
  "Membro",
  "Cargo",
  "Pactuado",
  "Alocado",
  "Projetos",
  "Aproveitamento",
  "Situação",
];

export const ALLOCATION_TABLE_HEADERS = [
  "Membro",
  "Projeto",
  "Carga semanal",
  "Período",
  "",
];

/**
 * Positions whose work is running the enterprise, not delivering contracts.
 *
 * A finance director with no project is doing their job; a consultant with no
 * project is on the way out. Without this distinction the screen would cry wolf
 * at half the board and the real warning would stop being read.
 */
export const RUNS_THE_ENTERPRISE: MemberRole[] = [
  "president",
  "vicePresident",
  "director",
];
