import { PageHeader } from "@/components/layout";
import {
  Button,
  EmptyState,
  FormDialog,
  QueryState,
  SkeletonTable,
} from "@/components/ui";
import { TimeEntryForm } from "./TimeEntryForm";
import { WeekEntriesTable } from "./WeekEntriesTable";
import { WeekGrid } from "./WeekGrid";
import { WeekToolbar } from "./WeekToolbar";
import { useTimesheetPage } from "./hooks";

const DESCRIPTION =
  "Registre quanto tempo você dedicou à EJ em cada dia da semana. Não é ponto: serve para a EJ entender onde o tempo está indo.";

const TimeEntriesPage: React.FC = () => {
  const sheet = useTimesheetPage();

  // A timesheet belongs to a member, not to a login. Showing the grid to an
  // account that matches nobody would let it log hours against an id no report
  // can ever attribute.
  if (sheet.unlinked)
    return (
      <>
        <PageHeader title="Minhas horas" description={DESCRIPTION} />
        <EmptyState
          title="Seu acesso ainda não está ligado a um cadastro de membro"
          description="A folha de horas pertence ao membro, não ao login. Peça à gestão de pessoas para cadastrar você como membro desta gestão — a partir daí a sua semana aparece aqui."
        />
      </>
    );

  return (
    <>
      <PageHeader
        title="Minhas horas"
        description={DESCRIPTION}
        action={
          <Button onClick={() => sheet.openDialog()}>Lançar horas</Button>
        }
      />

      <WeekToolbar {...sheet} />

      <QueryState
        query={sheet.entries}
        skeleton={
          <SkeletonTable rows={3} columns={9} label="Carregando a semana…" />
        }
      >
        {() => (
          <>
            {sheet.rows.length > 0 ? (
              <>
                <p className="mt-0 mb-3 text-sm text-tinta-suave">
                  Cada linha é uma atividade e cada coluna, um dia. Clique em um
                  dia para adicionar horas naquela atividade — ou use “Lançar
                  horas” para uma atividade nova.
                </p>
                <WeekGrid
                  days={sheet.days}
                  rows={sheet.rows}
                  today={sheet.today}
                  onCell={(row, date) =>
                    sheet.openDialog({
                      date,
                      category: row.category,
                      projectId: row.projectId,
                    })
                  }
                />
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-linha bg-papel-alto px-6 py-12 text-center">
                <p className="m-0 font-display text-md font-bold">
                  Nenhuma hora nesta semana
                </p>
                <p className="mx-auto mt-2 mb-6 max-w-[52ch] text-base leading-relaxed text-tinta-suave">
                  Clique em “Lançar horas” e informe o dia, a atividade e
                  quantas horas você trabalhou nela.
                </p>
                <Button onClick={() => sheet.openDialog()}>Lançar horas</Button>
              </div>
            )}

            <h2 className="mt-10 mb-1 font-display text-lg font-bold">
              Detalhes da semana
            </h2>
            <p className="mt-0 mb-4 text-sm text-tinta-suave">
              Cada lançamento separado, com o que foi feito. Lançou algo errado?
              Exclua aqui e lance de novo.
            </p>

            <WeekEntriesTable {...sheet} />
          </>
        )}
      </QueryState>

      <FormDialog
        open={sheet.dialog.open}
        title={
          sheet.alreadyLogged > 0 ? "Adicionar mais horas" : "Lançar horas"
        }
        submitLabel="Lançar"
        error={sheet.dialog.error}
        submitting={sheet.dialog.submitting}
        onSubmit={sheet.dialog.submit}
        onClose={sheet.dialog.close}
      >
        <TimeEntryForm
          value={sheet.dialog.form}
          projects={sheet.projects}
          alreadyLogged={sheet.alreadyLogged}
          onChange={sheet.dialog.setForm}
        />
      </FormDialog>
    </>
  );
};

export { TimeEntriesPage };
