import { PageHeader } from "@/components/layout";
import {
  Button,
  EmptyState,
  FormDialog,
  ListState,
  SkeletonBoard,
} from "@/components/ui";
import {
  PROJECT_BOARD_COLUMNS,
  PROJECT_STATUS_LABELS,
} from "@/domain/constants";
import { ProjectCard } from "./ProjectCard";
import { ProjectForm } from "./ProjectForm";
import { useProjectsPage } from "./hooks";

const ProjectsPage: React.FC = () => {
  const board = useProjectsPage();

  return (
    <>
      <PageHeader
        title="Projetos"
        description="Cada contrato com escopo, gerente, prazo e orçamento de horas visíveis para a diretoria inteira."
        action={
          board.editable && (
            <Button onClick={board.openDialog}>Novo projeto</Button>
          )
        }
      />

      <ListState
        query={board.projects}
        rows={board.projects.data ?? []}
        loadingLabel="Carregando projetos…"
        skeleton={<SkeletonBoard />}
        empty={
          <EmptyState
            title="Nenhum projeto nesta gestão"
            description="Abra o primeiro contrato da gestão para começar a acompanhar prazos, horas e margem."
            action={
              board.editable && (
                <Button onClick={board.openDialog}>Novo projeto</Button>
              )
            }
          />
        }
      >
        {(rows) => (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {PROJECT_BOARD_COLUMNS.map((column) => {
              const columnProjects = rows.filter(
                (project) => project.status === column,
              );

              return (
                <section
                  key={column}
                  aria-label={PROJECT_STATUS_LABELS[column]}
                  className="rounded-lg border border-linha bg-papel-alto p-3"
                >
                  <div className="mb-3 flex items-baseline justify-between border-b border-linha px-1 pb-2">
                    <h2 className="font-sans text-xs font-semibold text-tinta-suave">
                      {PROJECT_STATUS_LABELS[column]}
                    </h2>
                    <span className="text-xs text-tinta-suave">
                      {columnProjects.length}
                    </span>
                  </div>

                  <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                    {columnProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        clientName={board.clientName(project.clientId)}
                        ownerName={board.memberName(project.ownerId)}
                        margin={board.marginOf(project.id)}
                        editable={board.editable}
                        moving={board.moving}
                        onMove={(status) => board.move(project, status)}
                      />
                    ))}

                    {columnProjects.length === 0 && (
                      <li className="rounded-[6px] border border-dashed border-linha px-3 py-6 text-center text-sm text-tinta-suave">
                        Nada aqui ainda.
                      </li>
                    )}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </ListState>

      <FormDialog
        open={board.dialog.open}
        title="Novo projeto"
        submitLabel="Criar projeto"
        error={board.dialog.error}
        submitting={board.dialog.submitting}
        onSubmit={board.dialog.submit}
        onClose={board.dialog.close}
      >
        <ProjectForm
          value={board.dialog.form}
          clients={board.clients}
          members={board.members}
          onChange={board.dialog.setForm}
        />
      </FormDialog>
    </>
  );
};

export { ProjectsPage };
