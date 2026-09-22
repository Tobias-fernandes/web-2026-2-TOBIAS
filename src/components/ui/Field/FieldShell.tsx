import type { FieldShellProps } from "./types";

/** Label, hint and error wrapper shared by every field variant. */
const FieldShell: React.FC<FieldShellProps> = ({
  id,
  label,
  hint,
  error,
  children,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-tinta">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-ambar">{error}</p>
      ) : (
        hint && (
          <p className="text-xs leading-relaxed text-tinta-suave">{hint}</p>
        )
      )}
    </div>
  );
};

export { FieldShell };
