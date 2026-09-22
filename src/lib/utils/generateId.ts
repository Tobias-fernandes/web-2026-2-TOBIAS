/** A short, collision-safe-enough id for records the demo creates client-side. */
export const generateId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
