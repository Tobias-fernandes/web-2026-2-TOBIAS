import type { ReactNode } from "react";
import type { Tone } from "@/domain/constants";

export interface ProgressBarProps {
  /** 0-1. Values above 1 fill the bar and are reported in the label, not clipped. */
  ratio: number;
  label?: ReactNode;
  value?: ReactNode;
  tone?: Tone;
  /**
   * Second, thinner marker under the bar — the pace the term is running at, so a
   * goal can be read as ahead or behind instead of just "40%".
   */
  reference?: number;
  referenceLabel?: string;
  className?: string;
}
