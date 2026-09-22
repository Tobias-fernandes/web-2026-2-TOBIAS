import { PageHeader } from "@/components/layout";
import { GoalProgressList } from "@/components/reports";
import {
  Button,
  Card,
  CardTitle,
  FormDialog,
  QueryState,
  SkeletonBars,
  SkeletonChips,
} from "@/components/ui";
import { describeCycle } from "@/domain/constants";
import { CycleForm } from "./CycleForm";
import { CycleHistory } from "./CycleHistory";
import { CycleSheet } from "./CycleSheet";
import { useCyclePage } from "./hooks";

/**
 * The board's own screen: which term is open, what it committed to and how far
 * along it is. Everything else in the system is scoped to what is chosen here.
 */
const CyclePage: React.FC = () => {
  const term = useCyclePage();

  return (
    <>
      <PageHeader
        title="Gestão e metas"
        description="Cada ano é uma gestão: tem diretoria e metas próprias, e é o recorte de todo relatório do sistema. O fim fica em aberto até o dia da passagem de bastão."
        action={
          term.editable && (
            <Button onClick={() => term.dialog.openWith()}>Nova gestão</Button>
          )
        }
      />

      {term.cycles.isPending && (
        <SkeletonChips label="Carregando gestões…" className="mb-5" />
      )}

      {term.sorted.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {term.sorted.map((cycle) => (
            <button
              key={cycle.id}
              type="button"
              onClick={() => term.select(cycle.id)}
              aria-pressed={cycle.id === term.selected?.id}
              className={
                cycle.id === term.selected?.id
                  ? "rounded-sm border border-violeta bg-violeta-lav px-3 py-1.5 text-sm font-semibold text-violeta"
                  : "rounded-sm border border-linha bg-papel-alto px-3 py-1.5 text-sm text-tinta-suave hover:border-tinta hover:text-tinta"
              }
            >
              {describeCycle(cycle)}
            </button>
          ))}
        </div>
      )}

      {term.selected && (
        <div className="mb-8 grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardTitle
              action={
                term.editable && (
                  <Button variant="subtle" onClick={term.editSelected}>
                    Editar metas
                  </Button>
                )
              }
            >
              Metas da gestão {describeCycle(term.selected)}
            </CardTitle>

            <QueryState query={term.progress} skeleton={<SkeletonBars />}>
              {(progress) => <GoalProgressList progress={progress} />}
            </QueryState>
          </Card>

          <CycleSheet cycle={term.selected} />
        </div>
      )}

      <h2 className="mt-10 mb-4 font-display text-lg font-bold">
        Histórico de gestões
      </h2>

      <CycleHistory
        query={term.cycles}
        rows={term.sorted}
        editable={term.editable}
        onCreate={() => term.dialog.openWith()}
      />

      <FormDialog
        open={term.dialog.open}
        title={
          term.dialog.editing
            ? `Editar gestão ${term.selected ? describeCycle(term.selected) : ""}`
            : "Nova gestão"
        }
        submitLabel={term.dialog.editing ? "Salvar metas" : "Abrir gestão"}
        error={term.dialog.error}
        submitting={term.dialog.submitting}
        onSubmit={term.dialog.submit}
        onClose={term.dialog.close}
      >
        <CycleForm value={term.dialog.form} onChange={term.dialog.setForm} />
      </FormDialog>
    </>
  );
};

export { CyclePage };
