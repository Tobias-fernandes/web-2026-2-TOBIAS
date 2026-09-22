import { THEME_STORAGE_KEY } from './constants'
import type { ResolvedTheme, ThemePreference } from './types'

const DARK_QUERY = '(prefers-color-scheme: dark)'

const isPreference = (value: unknown): value is ThemePreference =>
  value === 'system' || value === 'light' || value === 'dark'

/** Reads the saved choice. Falls back to following the system. */
export function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isPreference(stored) ? stored : 'system'
  } catch {
    // Private browsing or blocked storage: the system preference still works.
    return 'system'
  }
}

export function writePreference(preference: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // No persistence available; the choice lasts for this tab only.
  }
}

export function systemTheme(): ResolvedTheme {
  return typeof window !== 'undefined' && window.matchMedia(DARK_QUERY).matches
    ? 'dark'
    : 'light'
}

export const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? systemTheme() : preference

/**
 * Writes the choice onto `<html>`.
 *
 * `system` clears the attribute rather than stamping the resolved value, so the
 * CSS media query keeps control and the page follows the reader if they flip
 * their OS theme while it is open — without this listening for anything.
 */
export function applyPreference(preference: ThemePreference): void {
  const root = document.documentElement
  if (preference === 'system') delete root.dataset.theme
  else root.dataset.theme = preference
}
