import type { ReactNode } from "react";

export interface SkeletonProps {
  className?: string;
}

export interface SkeletonRegionProps extends SkeletonProps {
  /** Announced while the content loads, in place of the visible blocks. */
  label?: string;
}

export interface SkeletonTableProps extends SkeletonRegionProps {
  rows?: number;
  columns?: number;
}

export interface SkeletonCountProps extends SkeletonRegionProps {
  count?: number;
}

export interface SkeletonRegionInnerProps {
  label: string;
  className?: string;
  children: ReactNode;
}
