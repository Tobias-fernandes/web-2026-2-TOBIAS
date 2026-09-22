/**
 * Allocation over commitment above this is flagged as overload.
 *
 * Not 1.0: a small overshoot is normal in a term, and flagging it would train
 * the board to ignore the warning.
 */
export const OVERLOAD_THRESHOLD = 1.15;

/** Below this share of the committed load, a member is drifting away. */
export const IDLE_UTILIZATION = 0.35;
