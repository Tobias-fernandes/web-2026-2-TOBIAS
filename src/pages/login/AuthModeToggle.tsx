import type { AuthSource } from "@/config/env";
import { activeAuthSource, writeDevAuthOverride } from "@/auth/services";
import { cn } from "@/lib/utils";

const OPTIONS: { value: AuthSource; label: string }[] = [
  { value: "cognito", label: "Cognito" },
  { value: "mock", label: "Contas de teste" },
];

/**
 * Dev-only: picks which auth backend the login screen talks to, without a
 * rebuild.
 *
 * Only ever rendered behind `import.meta.env.DEV` in `LoginPage` — statically
 * `false` in a production build, so this component and the override it writes
 * (`writeDevAuthOverride`) are dead code there. Reloads the page on change
 * rather than switching live: `authService` is resolved once per load, and a
 * full reload is what makes that resolution simple and never stale.
 */
const AuthModeToggle: React.FC = () => {
  function choose(source: AuthSource) {
    if (source === activeAuthSource) return;
    writeDevAuthOverride(source);
    window.location.reload();
  }

  return (
    <div className="mx-auto mb-8 flex w-fit gap-0.5 rounded-md border border-linha bg-papel p-0.5">
      {OPTIONS.map((option) => {
        const active = option.value === activeAuthSource;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => choose(option.value)}
            className={cn(
              "rounded-[5px] px-3 py-1.5 text-2xs font-medium transition-colors",
              active
                ? "bg-papel-alto font-semibold text-violeta shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
                : "text-tinta-suave hover:text-tinta",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export { AuthModeToggle };
