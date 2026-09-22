import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: ReactNode;
  action?: ReactNode;
}

export interface CardLinkProps {
  to: string;
  children: ReactNode;
}
