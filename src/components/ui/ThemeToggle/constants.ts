import type { ThemePreference } from "@/stores/theme";
import { MonitorIcon, MoonIcon, SunIcon } from "@/components/ui/icons";

export const THEME_ICONS: Record<ThemePreference, typeof SunIcon> = {
  system: MonitorIcon,
  light: SunIcon,
  dark: MoonIcon,
};
