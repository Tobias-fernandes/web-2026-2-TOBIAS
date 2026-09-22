import type { PageHeaderProps } from "./types";

/** Title and actions at the top of every page inside the system. */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        {description && (
          <p className="mt-2 mb-0 max-w-[68ch] text-base leading-relaxed text-tinta-suave">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
};

export { PageHeader };
