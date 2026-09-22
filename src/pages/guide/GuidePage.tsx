import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout";
import {
  Badge,
  Card,
  CardTitle,
  Table,
  TableCell,
  TableRow,
} from "@/components/ui";
import { ArrowRightIcon } from "@/components/ui/icons";
import { DIRECTORATE_LABELS } from "@/domain/constants";
import type { Tone } from "@/domain/constants";
import {
  CONCEPTS,
  DIRECTORATE_GUIDES,
  FLOW_STEPS,
  ROADMAP,
  ROADMAP_STATUS_LABELS,
  WEEKLY_ROUTINE,
} from "./constants";
import { DemoDataCard } from "./DemoDataCard";
import { useDemoData } from "./hooks";
import { ZeroFlow } from "./ZeroFlow";
import type { RoadmapStatus } from "./types";

const ROUTINE_HEADERS = ["Quando", "Quem", "O quê"];

const STATUS_TONES: Record<RoadmapStatus, Tone> = {
  done: "green",
  building: "amber",
  planned: "neutral",
};

/**
 * The manual, inside the system.
 *
 * A management system for a junior enterprise is handed to a new board every
 * year, and whoever wrote it is gone. This page is the handover: what the
 * system models, who does what in it, the weekly routine that keeps the data
 * honest, and what is still coming.
 */
export function GuidePage() {
  const demo = useDemoData();

  return (
    <>
      <PageHeader
        title="Como funciona"
        description="O caminho que um contrato percorre aqui dentro, o que cada diretoria faz no sistema e o que ainda está por vir."
      />

      <Card className="mb-6">
        <CardTitle>O caminho de um contrato</CardTitle>
        <p className="mt-0 mb-5 max-w-[72ch] text-base leading-relaxed text-tinta-suave">
          As telas não são módulos independentes: elas são etapas de uma
          corrente só. Um lead vira negociação, a negociação vira projeto, o
          projeto consome horas, e as horas dizem quanto aquele contrato
          realmente valeu. Se um elo deixa de ser preenchido, os relatórios
          seguintes param de fazer sentido.
        </p>

        <ol className="m-0 grid list-none gap-3 p-0 md:grid-cols-2 xl:grid-cols-4">
          {FLOW_STEPS.map((step) => (
            <li
              key={step.title}
              className="flex flex-col rounded-[6px] border border-linha bg-papel p-3.5"
            >
              <p className="m-0 font-display font-bold">{step.title}</p>
              <p className="mt-1.5 mb-3 flex-1 text-sm text-tinta-suave">
                {step.text}
              </p>
              <Link
                to={step.route}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-violeta no-underline"
              >
                Abrir {step.routeLabel}
                <ArrowRightIcon size={14} />
              </Link>
            </li>
          ))}
        </ol>
      </Card>

      <h2 className="mt-10 mb-4 font-display text-lg font-bold">
        O que cada diretoria faz aqui
      </h2>

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {DIRECTORATE_GUIDES.map((guide) => (
          <Card key={guide.directorate}>
            <h3 className="mt-0 mb-2 font-display text-base font-bold">
              {DIRECTORATE_LABELS[guide.directorate]}
            </h3>
            <p className="mt-0 mb-3 text-base leading-relaxed text-tinta-suave">
              {guide.does}
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {guide.screens.map((screen) => (
                <li key={screen.to}>
                  <Link
                    to={screen.to}
                    className="inline-block rounded-sm border border-linha px-2.5 py-1 text-sm text-tinta-suave no-underline hover:border-violeta hover:text-violeta"
                  >
                    {screen.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 mb-2 font-display text-lg font-bold">
        A rotina que faz funcionar
      </h2>
      <p className="mt-0 mb-3 max-w-[72ch] text-base leading-relaxed text-tinta-suave">
        Nenhum sistema de gestão sobrevive sem hábito. Estes cinco momentos são
        o mínimo — e o primeiro deles é o que sustenta todos os outros.
      </p>

      <Table headers={ROUTINE_HEADERS} className="mb-6">
        {WEEKLY_ROUTINE.map((item) => (
          <TableRow key={item.when}>
            <TableCell className="font-semibold whitespace-nowrap">
              {item.when}
            </TableCell>
            <TableCell className="whitespace-nowrap text-tinta-suave">
              {item.who}
            </TableCell>
            <TableCell>{item.what}</TableCell>
          </TableRow>
        ))}
      </Table>

      <h2 className="mt-10 mb-4 font-display text-lg font-bold">
        Conceitos do sistema
      </h2>

      <dl className="m-0 mb-8 grid gap-5 md:grid-cols-2">
        {CONCEPTS.map((concept) => (
          <div
            key={concept.term}
            className="rounded-lg border border-linha bg-papel-alto p-4"
          >
            <dt className="font-display font-bold">{concept.term}</dt>
            <dd className="m-0 mt-1 text-base leading-relaxed text-tinta-suave">
              {concept.meaning}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 mb-2 font-display text-lg font-bold">Roadmap</h2>
      <p className="mt-0 mb-4 max-w-[72ch] text-base leading-relaxed text-tinta-suave">
        O que já está no ar e o que vem depois. A ordem não é arbitrária: cada
        fase só faz sentido porque a anterior já alimenta o sistema com dado
        confiável.
      </p>

      <ol className="m-0 flex list-none flex-col gap-4 p-0">
        {ROADMAP.map((phase) => (
          <li
            key={phase.title}
            className="rounded-lg border border-linha bg-papel-alto p-5"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <h3 className="m-0 font-display text-base font-bold">
                {phase.title}
              </h3>
              <Badge tone={STATUS_TONES[phase.status]}>
                {ROADMAP_STATUS_LABELS[phase.status]}
              </Badge>
            </div>

            <p className="mt-0 mb-3 max-w-[72ch] text-base leading-relaxed text-tinta-suave">
              {phase.summary}
            </p>

            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {phase.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-base before:text-violeta before:content-['—']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 mb-2 font-display text-lg font-bold">
        Percorrer o sistema do zero
      </h2>
      <p className="mt-0 mb-4 max-w-[72ch] text-base leading-relaxed text-tinta-suave">
        Ler o modelo explica; começar do vazio ensina. Abaixo está a ordem em que
        um sistema sem nada dentro precisa ser preenchido — e a razão de ser
        nessa ordem é que cada passo depende do que o anterior criou.
      </p>

      <DemoDataCard demo={demo} />

      <ZeroFlow />
    </>
  );
}
