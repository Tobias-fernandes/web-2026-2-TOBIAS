import { create } from 'zustand'
import { applyPreference, readPreference, writePreference } from './theme'
import type { ThemeState } from './types'

/**
 * Light or dark, as the reader asked for it.
 *
 * The initial value is read synchronously at module load, matching the small
 * script in `index.html` that already stamped `<html>` before the first paint —
 * so the store never disagrees with what is on screen.
 */
export const useThemeStore = create<ThemeState>()((set) => ({
  preference: typeof window === 'undefined' ? 'system' : readPreference(),

  setPreference(preference) {
    applyPreference(preference)
    writePreference(preference)
    set({ preference })
  },
}))
