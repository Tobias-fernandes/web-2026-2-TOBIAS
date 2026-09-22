import type { ThemePreference } from "./types";

export const THEME_STORAGE_KEY = "altotech:theme";

export const THEME_PREFERENCES: ThemePreference[] = ["system", "light", "dark"];

export const THEME_LABELS: Record<ThemePreference, string> = {
  system: "Sistema",
  light: "Claro",
  dark: "Escuro",
};
