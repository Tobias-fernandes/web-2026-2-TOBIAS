import { DIRECTORATE_LABELS } from "@/domain/constants";
import type { Directorate, WorkArea } from "@/domain/types";

/**
 * Why a set of areas cannot be saved, or null when it can.
 *
 * Each area needs at least one function, and no function may belong to two
 * areas. The second rule keeps every function with one owner: with two finance
 * areas, "who directs finance" would have two answers, the ledger's budget per
 * area would split one function across both, and `areaOfDirectorate` — which
 * picks the area new finance lines and project deliveries default to — would
 * be choosing between them arbitrarily.
 *
 * Merging is the case this allows: "Comercial e Marketing" holding both
 * functions is one area with two, not two areas sharing one.
 */
export function workAreaConflict(
  areas: Pick<WorkArea, "name" | "directorates">[],
): string | null {
  const owner = new Map<Directorate, string>();

  for (const area of areas) {
    const name = area.name.trim();
    if (area.directorates.length === 0) {
      return `Escolha ao menos uma função para a área "${name}".`;
    }
    for (const directorate of area.directorates) {
      const previous = owner.get(directorate);
      if (previous !== undefined) {
        return `A função ${DIRECTORATE_LABELS[directorate]} está em "${previous}" e em "${name}". Cada função pertence a uma área só — junte as duas ou tire a função de uma delas.`;
      }
      owner.set(directorate, name);
    }
  }
  return null;
}

/** The area of this EJ that answers to a function — one at most, by the rule above. */
export const areaOfDirectorate = (
  areas: WorkArea[],
  directorate: Directorate,
): WorkArea | undefined =>
  areas.find((area) => area.directorates.includes(directorate));
