import type { ReactNode } from "react";
import type { Loadable } from "@/components/ui/QueryState";

export interface ListStateProps<T, TData> {
  /** The read this list came from; `isPending` and `error` travel together. */
  query: Loadable<TData>;
  /** Already filtered and sorted by the page — the state machine only counts them. */
  rows: T[];
  loadingLabel?: string;
  /**
   * Placeholder shaped like what is coming. Defaults to a table, which is what
   * most screens render; a board or a list of bars passes its own.
   */
  skeleton?: ReactNode;
  empty: ReactNode;
  children: (rows: T[]) => ReactNode;
}
