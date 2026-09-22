import { PageHeader } from "@/components/layout";
import {
  Button,
  Card,
  CardTitle,
  FormDialog,
  ListState,
  Table,
  TableCell,
  TableRow,
} from "@/components/ui";
import { formatDate, formatHours } from "@/lib/format";
import { AllocationForm } from "./AllocationForm";
import { CapacityAlerts } from "./CapacityAlerts";
import { CapacityTable } from "./CapacityTable";
import { useAllocationPage } from "./hooks";
import { ALLOCATION_TABLE_HEADERS } from "./constants";

export function AllocationPage() {
  const capacity = useAllocationPage();

  return (
    <>
      <PageHeader
        title="Alocação e capacidade"
        description="O que foi planejado para cada pessoa, ao lado do que ela realmente lançou. É aqui que sobrecarga e ociosidade aparecem antes do fim da gestão."
        action={
          capacity.editable && (
            <Button onClick={capacity.openDialog}>Nova alocação</Button>
          )
        }
      />

      <CapacityAlerts overloaded={capacity.overloaded} idle={capacity.idle} />

      <h2 className="mt-10 mb-4 font-display text-lg font-bold">
        Capacidade da equipe
      </h2>

      <CapacityTable workload={capacity.workload} />

      <Card className="mt-6">
        <CardTitle>Alocações abertas hoje</CardTitle>

        <ListState
          query={capacity.allocations}
          rows={capacity.allocations.data ?? []}
          empty={
            <p className="m-0 text-sm text-tinta-suave">
              Nenhuma alocação em vigor. Planejar a carga antes do trabalho
              começar é o que torna a capacidade acima comparável.
            </p>
          }
        >
          {(rows) => (
            <Table headers={ALLOCATION_TABLE_HEADERS}>
              {rows.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell className="font-medium">
                    {capacity.memberName(allocation.memberId)}
                  </TableCell>
                  <TableCell>
                    {capacity.projectName(allocation.projectId)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatHours(allocation.weeklyHours)}/sem
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-tinta-suave">
                    {formatDate(allocation.startsAt)} —{" "}
                    {formatDate(allocation.endsAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {capacity.editable && (
                      <button
                        type="button"
                        disabled={capacity.removing}
                        onClick={() => capacity.removeAllocation(allocation.id)}
                        className="rounded-[3px] px-2 py-1 text-sm text-tinta-suave hover:text-ambar disabled:opacity-55"
                      >
                        Remover
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          )}
        </ListState>
      </Card>

      <FormDialog
        open={capacity.dialog.open}
        title="Nova alocação"
        submitLabel="Alocar"
        error={capacity.dialog.error}
        submitting={capacity.dialog.submitting}
        onSubmit={capacity.dialog.submit}
        onClose={capacity.dialog.close}
      >
        <AllocationForm
          value={capacity.dialog.form}
          members={capacity.members}
          projects={capacity.openProjects}
          onChange={capacity.dialog.setForm}
        />
      </FormDialog>
    </>
  );
}
