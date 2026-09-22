import { CycleGoalsFields } from "@/components/forms";
import type {} from "../types";
import type { StepProps } from "./types";

const GoalsStep: React.FC<StepProps> = ({ value, onChange }) => {
  return (
    <CycleGoalsFields
      value={value.goals}
      onChange={(goals) => onChange({ ...value, goals })}
    />
  );
};

export { GoalsStep };
