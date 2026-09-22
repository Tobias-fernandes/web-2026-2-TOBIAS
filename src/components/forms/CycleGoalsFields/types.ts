import type { CycleGoalsFormState } from "@/lib/cycleGoals";

interface CycleGoalsFieldsProps {
  value: CycleGoalsFormState;
  onChange: (next: CycleGoalsFormState) => void;
}

export type { CycleGoalsFieldsProps };
