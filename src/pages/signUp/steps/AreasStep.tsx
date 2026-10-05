import { Button, Select, TextField } from "@/components/ui";
import { CloseIcon, InfoIcon } from "@/components/ui/icons";
import { DIRECTORATE_LABELS } from "@/domain/constants";
import type { Directorate } from "@/domain/types";
import { DIRECTORATE_HINTS, WORK_AREA_PRESETS } from "../constants";
import { useAreasStep } from "./hooks";
import type { StepProps } from "./types";

/** Picked from the "move" menu to leave a function with no area at all. */
const NO_AREA = "none";

const AreasStep: React.FC<StepProps> = ({ value, onChange }) => {
  const step = useAreasStep(value, onChange);

  const areaLabel = (index: number) =>
    step.areas[index].name.trim() || `Área ${index + 1} (sem nome)`;

  /** Every other area, then "no area" — where a function held here can go. */
  const destinations = (from: number | null) => [
    ...step.areas.flatMap((_, at) =>
      at === from ? [] : [{ value: String(at), label: areaLabel(at) }],
    ),
    ...(from === null ? [] : [{ value: NO_AREA, label: "Nenhuma área" }]),
  ];

  const move = (directorate: Directorate, target: string) =>
    step.assign(directorate, target === NO_AREA ? null : Number(target));

  return (
    <>
      <div className="flex gap-2.5 rounded-lg border border-violeta-lav bg-violeta-lav/40 p-3 text-sm leading-relaxed">
        <InfoIcon size={16} className="mt-0.5 shrink-0 text-violeta" />
        <p className="m-0">
          <strong>Presidente e vice acessam todas as telas pelo cargo</strong>,
          seja qual for a área deles — não é preciso juntar nada na Presidência
          para isso. Aqui você só conta como a EJ se divide, para o sistema
          saber qual diretor cuida de quê.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-tinta-suave">Começar de um modelo:</span>
        {WORK_AREA_PRESETS.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            variant="subtle"
            onClick={() => step.applyPreset(preset.areas)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <p className="m-0 text-sm text-tinta-suave">
        Áreas juntas? Mova a função para a outra área e renomeie — por exemplo,
        mova Marketing para Comercial e chame a área de “Comercial e Marketing”.
        Se o presidente também cuida do financeiro, mova Financeiro para a
        Presidência.
      </p>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {step.areas.map((area, index) => (
          <li
            key={index}
            className="flex flex-col gap-3 rounded-lg border border-linha p-3"
          >
            <div className="flex items-end gap-2">
              {/* The class would land on the input, not the field — hence the wrapper. */}
              <div className="flex-1">
                <TextField
                  label="Nome da área na sua EJ"
                  value={area.name}
                  onChange={(event) => step.rename(index, event.target.value)}
                />
              </div>
              <button
                type="button"
                aria-label={`Remover ${areaLabel(index)}`}
                title="Remover área"
                onClick={() => step.remove(index)}
                className="mb-2.5 rounded-md p-2 text-tinta-suave hover:bg-violeta-lav hover:text-violeta"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div>
              <p className="mt-0 mb-1.5 text-xs font-semibold text-tinta-suave">
                O diretor desta área cuida de
              </p>

              {area.directorates.length === 0 ? (
                <p className="m-0 rounded-md border border-dashed border-ambar px-3 py-2 text-sm text-tinta-suave">
                  {step.unassigned.length > 0
                    ? "Nenhuma função ainda. Adicione uma abaixo ou remova a área."
                    : "Nenhuma função ainda. Use “Mover para…” em outra área para trazer uma para cá, ou remova esta área."}
                </p>
              ) : (
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                  {area.directorates.map((directorate) => (
                    <li
                      key={directorate}
                      className="flex items-center justify-between gap-3 rounded-md bg-papel px-3 py-1.5"
                    >
                      <span className="min-w-0 text-sm">
                        <strong>{DIRECTORATE_LABELS[directorate]}</strong>
                        <span className="text-tinta-suave">
                          {" "}
                          — {DIRECTORATE_HINTS[directorate]}
                        </span>
                      </span>
                      <Select
                        size="compact"
                        value=""
                        placeholder="Mover para…"
                        aria-label={`Mover ${DIRECTORATE_LABELS[directorate]} para outra área`}
                        options={destinations(index)}
                        onValueChange={(target) => move(directorate, target)}
                        className="w-32 shrink-0"
                      />
                    </li>
                  ))}
                </ul>
              )}

              {step.unassigned.length > 0 && (
                <Select
                  size="compact"
                  value=""
                  placeholder="+ Adicionar função"
                  aria-label={`Adicionar função a ${areaLabel(index)}`}
                  options={step.unassigned.map((directorate) => ({
                    value: directorate,
                    label: DIRECTORATE_LABELS[directorate],
                  }))}
                  onValueChange={(directorate) =>
                    // The empty value is only the placeholder, never picked.
                    directorate && step.assign(directorate, index)
                  }
                  className="mt-2 w-44"
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="outline"
        onClick={step.add}
        className="self-start"
      >
        Adicionar área
      </Button>

      {step.unassigned.length > 0 && (
        <div className="rounded-lg border border-dashed border-linha p-3 text-sm">
          <p className="mt-0 mb-2 font-semibold">Funções sem área</p>
          <p className="mt-0 mb-3 text-tinta-suave">
            Tudo bem se a EJ não tem essa área — só a presidência vai cuidar
            dela. Se tem, escolha para onde vai.
          </p>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {step.unassigned.map((directorate) => (
              <li
                key={directorate}
                className="flex items-center justify-between gap-3"
              >
                <span className="min-w-0">
                  <strong>{DIRECTORATE_LABELS[directorate]}</strong>
                  <span className="text-tinta-suave">
                    {" "}
                    — {DIRECTORATE_HINTS[directorate]}
                  </span>
                </span>
                {step.areas.length > 0 && (
                  <Select
                    size="compact"
                    value=""
                    placeholder="Colocar em…"
                    aria-label={`Colocar ${DIRECTORATE_LABELS[directorate]} em uma área`}
                    options={destinations(null)}
                    onValueChange={(target) => move(directorate, target)}
                    className="w-32 shrink-0"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export { AreasStep };
