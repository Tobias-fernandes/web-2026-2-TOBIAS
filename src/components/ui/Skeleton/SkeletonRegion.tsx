import type {} from "react";
import { cn } from "@/lib/utils";
import type { SkeletonRegionInnerProps } from "./types";

/**
 * One announcement for a whole placeholder.
 *
 * The blocks are `aria-hidden`; this wrapper is what a screen reader hears, so
 * the experience is the same sentence the spinner used to say.
 */
const SkeletonRegion: React.FC<SkeletonRegionInnerProps> = ({
  label,
  className,
  children,
}) => {
  return (
    <div role="status" aria-busy className={cn(className)}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
};

export { SkeletonRegion };
