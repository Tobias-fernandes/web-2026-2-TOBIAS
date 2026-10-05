import { CycleGoalsFields } from "@/components/forms";
import type { StepProps } from "./types";

const GoalsStep: React.FC<StepProps> = ({ value, onChange }) => {
  return (
    <>
      {value.cycleStart.ongoing && (
        <p className="m-0 text-sm text-tinta-suave">
          As metas valem para a gestão inteira, desde o dia em que a diretoria
          assumiu. O que já foi entregue conta para elas.
        </p>
      )}
      <CycleGoalsFields
        value={value.goals}
        onChange={(goals) => onChange({ ...value, goals })}
      />
    </>
  );
};

export { GoalsStep };
