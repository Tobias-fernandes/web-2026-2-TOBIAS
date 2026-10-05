import { nameOptions, SelectField, TextField } from "@/components/ui";
import type {} from "@/domain/types";
import { setField } from "@/lib/utils";
import type { AllocationFormProps } from "./types";

const AllocationForm: React.FC<AllocationFormProps> = ({
  value,
  members,
  projects,
  onChange,
}) => {
  const set = setField(value, onChange);

  return (
    <>
      <SelectField
        label="Membro"
        value={value.memberId}
        onValueChange={(next) => set("memberId", next)}
        options={nameOptions(members)}
      />
      <SelectField
        label="Projeto"
        value={value.projectId}
        onValueChange={(next) => set("projectId", next)}
        options={nameOptions(projects)}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Horas por semana"
          type="number"
          min={1}
          step={1}
          value={value.weeklyHours}
          onChange={(event) => set("weeklyHours", event.target.value)}
        />
        <TextField
          label="De"
          type="date"
          value={value.startsAt}
          onChange={(event) => set("startsAt", event.target.value)}
        />
        <TextField
          label="Até"
          type="date"
          value={value.endsAt}
          onChange={(event) => set("endsAt", event.target.value)}
        />
      </div>
    </>
  );
};

export { AllocationForm };
