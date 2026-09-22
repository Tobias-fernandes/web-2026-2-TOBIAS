import {
  Badge,
  Button,
  EmptyState,
  ListState,
  SkeletonTable,
  Table,
  TableCell,
  TableRow,
} from "@/components/ui";
import type {} from "@/components/ui";
import {
  CYCLE_STATUS_LABELS,
  CYCLE_STATUS_TONES,
  describeCycle,
} from "@/domain/constants";
import type {} from "@/domain/types";
import { formatMoney, formatPeriod } from "@/lib/format";
import { CYCLES_TABLE_HEADERS } from "./constants";
import type { CycleHistoryProps } from "./types";

/** Every management the EJ has had, newest first. */
const CycleHistory: React.FC<CycleHistoryProps> = ({
  query,
  rows,
  editable,
  onCreate,
}) => {
  return (
    <ListState
      query={query}
      rows={rows}
      skeleton={<SkeletonTable columns={6} />}
      empty={
        <EmptyState
          title="Nenhuma gestão cadastrada"
          description="Abra a gestão do ano para que projetos, horas e metas tenham um período de referência."
          action={editable && <Button onClick={onCreate}>Nova gestão</Button>}
        />
      }
    >
      {(cycles) => (
        <Table headers={CYCLES_TABLE_HEADERS}>
          {cycles.map((cycle) => (
            <TableRow key={cycle.id}>
              <TableCell className="font-semibold">
                {describeCycle(cycle)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-tinta-suave">
                {formatPeriod(cycle.startsAt, cycle.endsAt)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatMoney(cycle.goals.revenueCents)}
              </TableCell>
              <TableCell>{cycle.goals.projects}</TableCell>
              <TableCell>{cycle.goals.members}</TableCell>
              <TableCell>
                <Badge tone={CYCLE_STATUS_TONES[cycle.status]}>
                  {CYCLE_STATUS_LABELS[cycle.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </ListState>
  );
};

export { CycleHistory };
