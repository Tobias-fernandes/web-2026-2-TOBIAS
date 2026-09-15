import { cn } from '@/lib/utils'
import type { TableCellProps, TableProps, TableRowProps } from './types'

/** Wraps the table in a scrollable container so it never widens the page. */
export function Table({ headers, children, className }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-linha bg-papel-alto">
      <table className={cn('w-full border-collapse text-left text-sm', className)}>
        <thead>
          <tr className="border-b border-linha">
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-3 text-[0.75rem] font-semibold tracking-wide text-tinta-suave uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function TableRow({ children }: TableRowProps) {
  return (
    <tr className="border-b border-linha last:border-0 hover:bg-papel">{children}</tr>
  )
}

export function TableCell({ children, className }: TableCellProps) {
  return <td className={cn('px-4 py-3 align-middle', className)}>{children}</td>
}
