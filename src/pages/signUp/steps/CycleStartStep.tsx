import { TextField } from "@/components/ui";
import { todayIso } from "@/lib/date";
import { cn, setField } from "@/lib/utils";
import type { CycleStartDraft } from "../types";
import type { StepProps } from "./types";

const CHOICES: { ongoing: boolean; title: string; text: string }[] = [
  {
    ongoing: false,
    title: "Está começando agora",
    text: "A diretoria acabou de assumir. A gestão abre hoje, junto com o sistema.",
  },
  {
    ongoing: true,
    title: "Já está em andamento",
    text: "A diretoria já assumiu há algum tempo e já tem caixa, clientes ou projetos.",
  },
];

/**
 * Whether the EJ adopts the system on day one of its management or halfway
 * through — and, if halfway, the few figures only the president can give.
 *
 * Only what no other screen can recover is asked here. Clients, projects,
 * members and open instalments each have their own screen, which the dashboard
 * points to right after sign-up.
 */
const CycleStartStep: React.FC<StepProps> = ({ value, onChange }) => {
  const draft = value.cycleStart;
  const set = setField(draft, (cycleStart: CycleStartDraft) =>
    onChange({ ...value, cycleStart }),
  );

  return (
    <>
      <div
        role="radiogroup"
        aria-label="A gestão já está em andamento?"
        className="grid gap-3 sm:grid-cols-2"
      >
        {CHOICES.map((choice) => {
          const selected = draft.ongoing === choice.ongoing;
          return (
            <button
              key={choice.title}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => set("ongoing", choice.ongoing)}
              className={cn(
                "cursor-pointer rounded-lg border bg-transparent p-4 text-left text-tinta transition-colors",
                selected
                  ? "border-violeta ring-1 ring-violeta"
                  : "border-linha hover:bg-papel-alto",
              )}
            >
              <span className="block font-semibold">{choice.title}</span>
              <span className="mt-1 block text-sm text-tinta-suave">
                {choice.text}
              </span>
            </button>
          );
        })}
      </div>

      {draft.ongoing && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="A diretoria assumiu em"
              type="date"
              max={todayIso()}
              value={draft.startsAt}
              onChange={(event) => set("startsAt", event.target.value)}
            />
            <TextField
              label="Saldo em caixa hoje (R$)"
              inputMode="decimal"
              placeholder="12500"
              hint="O que está na conta da EJ agora."
              value={draft.balance}
              onChange={(event) => set("balance", event.target.value)}
            />
            <TextField
              label="Faturamento de projetos entregues (R$)"
              inputMode="decimal"
              placeholder="18000"
              hint="Soma dos contratos já entregues nesta gestão."
              value={draft.contractedRevenue}
              onChange={(event) => set("contractedRevenue", event.target.value)}
            />
            <TextField
              label="Projetos já entregues"
              type="number"
              min={0}
              step={1}
              placeholder="3"
              value={draft.deliveredProjects}
              onChange={(event) => set("deliveredProjects", event.target.value)}
            />
          </div>

          <p className="m-0 text-sm text-tinta-suave">
            Estes números entram nas metas e no saldo como ponto de partida.
            Projetos em execução ficam de fora daqui: cadastre-os depois, em
            Projetos, e eles entram na meta por lá. Pelo mesmo motivo, não
            cadastre de novo os projetos entregues nem os pagamentos que já
            caíram no saldo — só as parcelas ainda a receber ou a pagar.
          </p>
        </>
      )}
    </>
  );
};

export { CycleStartStep };
