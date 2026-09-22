/**
 * `system` follows the operating system and keeps following it; the other two
 * are a decision the reader made and that has to survive a reload.
 */
export type ThemePreference = 'system' | 'light' | 'dark'

/** What is actually painted right now, once `system` has been resolved. */
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeState {
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
}
