import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TableProps {
  headers: ReactNode[]
  children: ReactNode
  className?: string
}

export interface TableRowProps {
  children: ReactNode
}

export interface TableCellProps {
  children: ReactNode
  className?: string
}

/** Wraps the table in a scrollable container so it never widens the page. */
export function Table({ headers, children, className }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-linha bg-papel-alto">
      <table className={cn('w-full border-collapse text-left text-sm', className)}>
        <thead>
          <tr className="border-b border-linha">
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-3.5 text-xs font-semibold text-tinta-suave"
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
  return <td className={cn('px-4 py-3.5 align-middle', className)}>{children}</td>
}
