import { useThemeStore } from "./themeStore";
import type { ThemePreference } from "./types";

export const useThemePreference = (): ThemePreference =>
  useThemeStore((state) => state.preference);

export const useSetThemePreference = () =>
  useThemeStore((state) => state.setPreference);
