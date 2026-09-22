import type { ReactNode } from "react";
import type { Tone } from "@/domain/constants";

export interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}
