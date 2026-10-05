import type { Cycle, Project } from "@/domain/types";
import { isCountableProject } from "./predicates";

/** What a management had delivered before the EJ started using the system. */
export interface CarriedOver {
  contractedRevenueCents: number;
  deliveredProjects: number;
}

/**
 * The part of a management's goals that happened before sign-up.
 *
 * It counts: the board committed to the year, not to the months since it
 * adopted the system. Zeros for a management that started with the system, so
 * a report adds this unconditionally instead of branching on how the EJ
 * arrived.
 */
export const carriedOver = (cycle: Cycle | null | undefined): CarriedOver => ({
  contractedRevenueCents: cycle?.startingPoint?.contractedRevenueCents ?? 0,
  deliveredProjects: cycle?.startingPoint?.deliveredProjects ?? 0,
});

/** The two goal figures read from contracts: revenue closed and projects closed. */
export interface GoalFigures {
  contractedRevenueCents: number;
  closedProjects: number;
}

/**
 * Contracted revenue and closed projects of a management — its registered
 * contracts plus what it had delivered before the system.
 *
 * One definition because two screens show it side by side, the dashboard's
 * revenue card and the goal bar, and they must never disagree; the backend
 * mirrors this, not a sum per report.
 */
export function goalFigures(
  cycleProjects: Project[],
  cycle: Cycle | null | undefined,
): GoalFigures {
  const countable = cycleProjects.filter(isCountableProject);
  const carried = carriedOver(cycle);
  return {
    contractedRevenueCents:
      countable.reduce(
        (total, project) => total + project.contractValueCents,
        0,
      ) + carried.contractedRevenueCents,
    closedProjects: countable.length + carried.deliveredProjects,
  };
}
