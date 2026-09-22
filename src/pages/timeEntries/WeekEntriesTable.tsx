import { ListState, Table, TableCell, TableRow } from "@/components/ui";
import { TIME_ENTRY_CATEGORY_LABELS } from "@/domain/constants";
import { formatDate, formatHours } from "@/lib/format";
import { NO_PROJECT, WEEK_ENTRIES_HEADERS } from "./constants";
import type { TimesheetPageState } from "./types";

type WeekEntriesTableProps = Pick<
  TimesheetPageState,
  | "entries"
  | "weekEntries"
  | "weekStart"
  | "weekEnd"
  | "projectName"
  | "deleting"
  | "removeEntry"
>;

/** The week's entries as rows, with what can still be undone. */
const WeekEntriesTable: React.FC<WeekEntriesTableProps> = (props) => {
  return (
    <ListState
      query={props.entries}
      rows={props.weekEntries}
      empty={
        <p className="m-0 text-sm text-tinta-suave">
          Nada lançado entre {formatDate(props.weekStart)} e{" "}
          {formatDate(props.weekEnd)}.
        </p>
      }
    >
      {(list) => (
        <Table headers={WEEK_ENTRIES_HEADERS}>
          {list.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="whitespace-nowrap text-tinta-suave">
                {formatDate(entry.date)}
              </TableCell>
              <TableCell className="text-tinta-suave">
                {TIME_ENTRY_CATEGORY_LABELS[entry.category]}
              </TableCell>
              <TableCell className="font-medium">
                {entry.projectId
                  ? props.projectName(entry.projectId)
                  : NO_PROJECT}
              </TableCell>
              <TableCell className="text-tinta-suave">
                {entry.description}
              </TableCell>
              <TableCell className="whitespace-nowrap font-display font-bold">
                {formatHours(entry.hours)}
              </TableCell>
              <TableCell className="text-right">
                <button
                  type="button"
                  disabled={props.deleting}
                  onClick={() => props.removeEntry(entry.id)}
                  className="rounded-md px-2 py-1 text-sm text-tinta-suave hover:text-vermelho disabled:opacity-55"
                >
                  Excluir
                </button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </ListState>
  );
};

export { WeekEntriesTable };
