import type { ReactNode } from "react";

export interface TableProps {
  headers: ReactNode[];
  children: ReactNode;
  className?: string;
}

export interface TableRowProps {
  children: ReactNode;
}

export interface TableCellProps {
  children: ReactNode;
  className?: string;
}
