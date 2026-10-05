import {
  labelOptions,
  nameOptions,
  SelectField,
  TextField,
} from "@/components/ui";
import { TIME_ENTRY_CATEGORY_LABELS } from "@/domain/constants";
import { formatHours } from "@/lib/format";
import { setField } from "@/lib/utils";
import {
  DEFAULT_TIME_ENTRY_CATEGORY_HINT,
  HOURS_STEP,
  TIME_ENTRY_CATEGORY_HINTS,
} from "./constants";
import type { TimeEntryFormProps } from "./types";

const CATEGORY_OPTIONS = labelOptions(TIME_ENTRY_CATEGORY_LABELS);

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  value,
  projects,
  alreadyLogged = 0,
  onChange,
}) => {
  const set = setField(value, onChange);
  const needsProject = value.category === "project";
  const adding = Number(value.hours) > 0 ? Number(value.hours) : 0;

  return (
    <>
      <SelectField
        label="Em que você trabalhou?"
        hint={
          TIME_ENTRY_CATEGORY_HINTS[value.category] ??
          DEFAULT_TIME_ENTRY_CATEGORY_HINT
        }
        value={value.category}
        onValueChange={(next) =>
          onChange({
            ...value,
            category: next,
            // Leaving the project behind on a non-project entry would attribute
            // internal hours to a contract and distort its margin.
            projectId: next === "project" ? value.projectId : "",
          })
        }
        options={CATEGORY_OPTIONS}
      />

      {needsProject && (
        <SelectField
          label="Qual projeto?"
          value={value.projectId}
          onValueChange={(next) => set("projectId", next)}
          options={nameOptions(projects)}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Dia"
          type="date"
          value={value.date}
          onChange={(event) => set("date", event.target.value)}
        />
        <TextField
          label="Quantas horas?"
          hint="Use 0,5 para meia hora."
          type="number"
          min={HOURS_STEP}
          step={HOURS_STEP}
          value={value.hours}
          onChange={(event) => set("hours", event.target.value)}
          placeholder="4"
        />
      </div>

      {alreadyLogged > 0 && (
        <div className="rounded-md border border-violeta-lav bg-violeta-lav/40 px-3 py-2.5 text-sm leading-relaxed">
          Este dia já tem <strong>{formatHours(alreadyLogged)}</strong> nesta
          atividade. As horas acima são <strong>somadas</strong> a elas
          {adding > 0 && (
            <>
              {" "}
              — o dia fica com{" "}
              <strong>{formatHours(alreadyLogged + adding)}</strong>
            </>
          )}
          . Para corrigir um valor, exclua o lançamento em “Detalhes da semana”.
        </div>
      )}

      <TextField
        label="O que foi feito (opcional)"
        value={value.description}
        onChange={(event) => set("description", event.target.value)}
        placeholder="Ex.: reunião com o cliente, protótipo da tela inicial."
      />
    </>
  );
};

export { TimeEntryForm };
