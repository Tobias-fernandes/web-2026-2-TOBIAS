import { Button, labelOptions, SelectField, TextField } from "@/components/ui";
import { CloseIcon } from "@/components/ui/icons";
import { DIRECTORATE_LABELS } from "@/domain/constants";
import type { Directorate } from "@/domain/types";
import type { WorkAreaDraft } from "../types";
import type { StepProps } from "./types";

const FUNCTION_OPTIONS = labelOptions(DIRECTORATE_LABELS);

const AreasStep: React.FC<StepProps> = ({ value, onChange }) => {
  function setArea(index: number, area: WorkAreaDraft) {
    onChange({
      ...value,
      workAreas: value.workAreas.map((item, at) =>
        at === index ? area : item,
      ),
    });
  }

  function remove(index: number) {
    onChange({
      ...value,
      workAreas: value.workAreas.filter((_, at) => at !== index),
    });
  }

  function add() {
    onChange({
      ...value,
      workAreas: [...value.workAreas, { name: "", directorate: "projects" }],
    });
  }

  return (
    <>
      <p className="mt-0 mb-1 text-sm text-tinta-suave">
        O nome é o que a sua EJ usa. A função ao lado é o que o sistema entende
        — é ela que decide, por exemplo, quem enxerga o financeiro.
      </p>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {value.workAreas.map((area, index) => (
          <li key={index} className="flex items-end gap-2">
            <TextField
              label="Nome da área"
              className="flex-1"
              value={area.name}
              onChange={(event) =>
                setArea(index, { ...area, name: event.target.value })
              }
            />
            <SelectField
              label="Função"
              className="w-44"
              value={area.directorate}
              onChange={(event) =>
                setArea(index, {
                  ...area,
                  directorate: event.target.value as Directorate,
                })
              }
              options={FUNCTION_OPTIONS}
            />
            <button
              type="button"
              aria-label={`Remover ${area.name || "área"}`}
              onClick={() => remove(index)}
              className="mb-2.5 rounded-md p-2 text-tinta-suave hover:bg-violeta-lav hover:text-violeta"
            >
              <CloseIcon size={16} />
            </button>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="outline"
        onClick={add}
        className="self-start"
      >
        Adicionar área
      </Button>
    </>
  );
};

export { AreasStep };
