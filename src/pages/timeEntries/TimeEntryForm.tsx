import {
  labelOptions,
  nameOptions,
  SelectField,
  TextField,
} from "@/components/ui";
import { TIME_ENTRY_CATEGORY_LABELS } from "@/domain/constants";
import type { TimeEntryCategory } from "@/domain/types";
import { setField } from "@/lib/utils";
import { HOURS_STEP } from "./constants";
import type { TimeEntryFormProps } from "./types";

const CATEGORY_OPTIONS = labelOptions(TIME_ENTRY_CATEGORY_LABELS);

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  value,
  projects,
  onChange,
}) => {
  const set = setField(value, onChange);
  const needsProject = value.category === "project";

  return (
    <>
      <SelectField
        label="Tipo de hora"
        hint="Reunião de diretoria, capacitação e prospecção também são horas da EJ."
        value={value.category}
        onChange={(event) =>
          onChange({
            ...value,
            category: event.target.value as TimeEntryCategory,
            // Leaving the project behind on a non-project entry would attribute
            // internal hours to a contract and distort its margin.
            projectId: event.target.value === "project" ? value.projectId : "",
          })
        }
        options={CATEGORY_OPTIONS}
      />

      {needsProject && (
        <SelectField
          label="Projeto"
          value={value.projectId}
          onChange={(event) => set("projectId", event.target.value)}
          options={nameOptions(projects)}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Data"
          type="date"
          value={value.date}
          onChange={(event) => set("date", event.target.value)}
        />
        <TextField
          label="Horas"
          type="number"
          min={HOURS_STEP}
          step={HOURS_STEP}
          value={value.hours}
          onChange={(event) => set("hours", event.target.value)}
          placeholder="4"
        />
      </div>

      <TextField
        label="Descrição"
        value={value.description}
        onChange={(event) => set("description", event.target.value)}
        placeholder="O que foi feito nessas horas."
      />
    </>
  );
};

export { TimeEntryForm };
