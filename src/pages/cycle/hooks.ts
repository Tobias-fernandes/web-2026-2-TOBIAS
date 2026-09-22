import { useEffect, useMemo, useState } from "react";
import { useFormDialog } from "@/components/ui";
import { can } from "@/domain/access";
import type { Cycle } from "@/domain/types";
import {
  cycleGoalsFromForm,
  cycleGoalsToForm,
  validateCycleGoals,
} from "@/lib/cycleGoals";
import { todayIso } from "@/lib/date";
import { zodValidate } from "@/lib/validation";
import {
  useActiveCycle,
  useCycleProgress,
  useCycles,
  useUpsertCycle,
} from "@/queries";
import { useCurrentUser } from "@/stores/auth";
import { buildEmptyCycleForm } from "./constants";
import { buildCycleFormSchema } from "./schemas";
import type { CycleFormState, CyclePageState } from "./types";

const formFrom = (cycle: Cycle): CycleFormState => ({
  startsAt: cycle.startsAt,
  status: cycle.status,
  ...cycleGoalsToForm(cycle.goals),
});

export function useCyclePage(): CyclePageState {
  const user = useCurrentUser();
  const cycles = useCycles();
  const { cycle: active } = useActiveCycle();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Follows the management in progress until the reader picks another to read.
  useEffect(() => {
    if (!selectedId && active) setSelectedId(active.id);
  }, [active, selectedId]);

  const selected =
    (cycles.data ?? []).find((item) => item.id === selectedId) ?? null;

  const byId = useMemo(
    () => new Map((cycles.data ?? []).map((item) => [item.id, item])),
    [cycles.data],
  );

  const dialog = useFormDialog({
    initial: buildEmptyCycleForm,
    mutation: useUpsertCycle(),
    validate: (form, editing) => {
      const others = (cycles.data ?? []).filter((item) => item.id !== editing);
      return (
        zodValidate(buildCycleFormSchema(others), form) ??
        validateCycleGoals(form)
      );
    },
    toInput: (form, editing) => {
      const current = editing ? byId.get(editing) : undefined;

      return {
        id: editing,
        input: {
          startsAt: form.startsAt,
          /**
           * Closing is what dates the management: a board only learns the day it
           * hands over when the day arrives. Whatever was already stamped is
           * kept, so correcting a goal on a closed term does not re-date it.
           */
          endsAt:
            form.status === "closed" ? (current?.endsAt ?? todayIso()) : null,
          status: form.status,
          goals: cycleGoalsFromForm(form),
        },
      };
    },
    successMessage: (editing) =>
      editing ? "Gestão atualizada." : "Gestão criada.",
  });

  return {
    editable: can(user, "cycle:manage"),
    cycles,
    sorted: [...(cycles.data ?? [])].sort((a, b) =>
      b.startsAt.localeCompare(a.startsAt),
    ),
    selected,
    select: setSelectedId,
    progress: useCycleProgress(selected?.id),
    dialog,
    editSelected: () => {
      if (selected) dialog.openFor(selected.id, formFrom(selected));
    },
  };
}
