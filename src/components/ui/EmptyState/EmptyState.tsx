import type {} from "react";
import type { EmptyStateProps } from "./types";

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="rounded-xl border border-dashed border-linha bg-papel-alto px-6 py-12 text-center">
      <p className="font-display text-md font-bold text-tinta">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-[52ch] text-base leading-relaxed text-tinta-suave">
          {description}
        </p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
};

export { EmptyState };
