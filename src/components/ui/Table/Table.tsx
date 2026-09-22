import type {} from "react";
import { cn } from "@/lib/utils";
import type { TableProps, TableRowProps, TableCellProps } from "./types";

/** Wraps the table in a scrollable container so it never widens the page. */
const Table: React.FC<TableProps> = ({ headers, children, className }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-linha bg-papel-alto">
      <table
        className={cn("w-full border-collapse text-left text-sm", className)}
      >
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
  );
};

const TableRow: React.FC<TableRowProps> = ({ children }) => {
  return (
    <tr className="border-b border-linha last:border-0 hover:bg-papel">
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({ children, className }) => {
  return (
    <td className={cn("px-4 py-3.5 align-middle", className)}>{children}</td>
  );
};

export { Table };

export { TableRow, TableCell };
