import {
  Card,
  CardTitle,
  Note,
  QueryState,
  SkeletonTable,
  Table,
  TableCell,
  TableRow,
} from "@/components/ui";
import type { Loadable } from "@/components/ui";
import { DEAL_SOURCE_LABELS } from "@/domain/constants";
import type { FunnelSummary } from "@/domain/types";
import { formatMoney, formatPercent } from "@/lib/format";
import { SOURCE_TABLE_HEADERS } from "./constants";

/** Where the contracts come from, and which origin actually closes. */
const SourceTable: React.FC<{
  summary: Loadable<FunnelSummary>;
}> = ({ summary }) => {
  return (
    <QueryState
      query={summary}
      skeleton={<SkeletonTable columns={5} rows={3} />}
    >
      {(data) =>
        data.bySource.length === 0 ? null : (
          <Card className="mt-10">
            <CardTitle>De onde vêm os contratos</CardTitle>

            <Table headers={SOURCE_TABLE_HEADERS}>
              {data.bySource.map((row) => (
                <TableRow key={row.source}>
                  <TableCell className="font-medium">
                    {DEAL_SOURCE_LABELS[row.source]}
                  </TableCell>
                  <TableCell className="text-center">{row.deals}</TableCell>
                  <TableCell className="text-center">{row.won}</TableCell>
                  <TableCell>{formatPercent(row.conversion)}</TableCell>
                  <TableCell className="whitespace-nowrap font-display font-bold">
                    {formatMoney(row.wonValueCents)}
                  </TableCell>
                </TableRow>
              ))}
            </Table>

            <Note>
              A origem que mais gera oportunidade quase nunca é a que mais
              fecha. Essa tabela é o que decide onde o comercial e o marketing
              gastam o ano.
            </Note>
          </Card>
        )
      }
    </QueryState>
  );
};

export { SourceTable };
