import type { ToastVariant } from "./types";

/** How long each variant stays before dismissing itself — errors linger longer. */
export const TOAST_DURATION_MS: Record<ToastVariant, number> = {
  success: 4000,
  info: 4000,
  error: 6000,
};
