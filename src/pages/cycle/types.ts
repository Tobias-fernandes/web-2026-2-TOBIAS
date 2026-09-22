import type { FormDialogState, Loadable } from "@/components/ui";
import type { Cycle, CycleProgress, CycleStatus } from "@/domain/types";
import type { CycleGoalsFormState } from "@/lib/cycleGoals";

export interface CycleFormState extends CycleGoalsFormState {
  startsAt: string;
  status: CycleStatus;
}

export interface CyclePageState {
  editable: boolean;
  cycles: Loadable<Cycle[]>;
  /** Newest management first, which is the order a board thinks in. */
  sorted: Cycle[];
  selected: Cycle | null;
  select: (id: string) => void;
  progress: Loadable<CycleProgress | null>;
  dialog: FormDialogState<CycleFormState>;
  /** Opens the same dialog on the management being looked at. */
  editSelected: () => void;
}

export interface CycleFormProps {
  value: CycleFormState;
  onChange: (next: CycleFormState) => void;
}

export interface CycleHistoryProps {
  query: Loadable<Cycle[]>;
  rows: Cycle[];
  editable: boolean;
  onCreate: () => void;
}
