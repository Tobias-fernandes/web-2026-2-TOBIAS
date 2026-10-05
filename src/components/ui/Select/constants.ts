import { FIELD_BASE_CLASSES } from "../Field/constants";

/** Trigger per size. `field` is the same box as every other form field. */
export const TRIGGER_SIZE_CLASSES = {
  field: `${FIELD_BASE_CLASSES} flex items-center justify-between gap-2 text-left`,
  compact:
    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold",
} as const;

/** Space between the trigger and the list, and between the list and the viewport's edge. */
export const LIST_OFFSET_PX = 4;
export const VIEWPORT_MARGIN_PX = 8;

/** Typing letters within this window extends the search instead of restarting it. */
export const TYPEAHEAD_RESET_MS = 600;

/** How far PageUp and PageDown move through a long list. */
export const PAGE_STEP = 10;
