import { cn } from '@/lib/utils'
import {
  THEME_LABELS,
  THEME_PREFERENCES,
  useSetThemePreference,
  useThemePreference,
} from '@/stores/theme'
import { THEME_ICONS } from './constants'

export interface ThemeToggleProps {
  className?: string
  /** Keeps accessible labels while displaying only icons in narrow toolbars. */
  compact?: boolean
}

/**
 * Light, dark, or whatever the system says.
 *
 * Three states rather than a switch: "sistema" is the honest default — it keeps
 * following the reader's OS after they close the tab — and a two-way switch
 * would silently turn that off the first time someone touched it.
 */
export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const preference = useThemePreference()
  const setPreference = useSetThemePreference()

  return (
    <div
      className={cn(
        'flex gap-0.5 rounded-md border border-linha bg-papel p-0.5',
        className,
      )}
    >
      {THEME_PREFERENCES.map((option) => {
        const Icon = THEME_ICONS[option]
        const active = option === preference

        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            title={compact ? THEME_LABELS[option] : undefined}
            onClick={() => setPreference(option)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-[5px] px-2 py-1.5 text-2xs font-medium transition-colors',
              active
                ? 'bg-papel-alto font-semibold text-violeta shadow-[0_1px_2px_rgb(0_0_0/0.06)]'
                : 'text-tinta-suave hover:text-tinta',
            )}
          >
            <Icon size={14} />
            <span className={compact ? 'sr-only' : undefined}>{THEME_LABELS[option]}</span>
          </button>
        )
      })}
    </div>
  )
}
