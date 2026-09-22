import type { ReactNode } from "react";

export interface MetricCardProps {
  label: string;
  value: string;
  hint?: ReactNode;
}
