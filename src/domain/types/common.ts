export type ID = string;

/** Date without a time component, as `YYYY-MM-DD`. Every date in the domain. */
export type IsoDate = string;

/**
 * Time of day as `HH:MM`, 24-hour. Only the calendar carries one.
 *
 * Kept apart from the date for the same reason the date has no timestamp: a
 * commitment happens at 19:00 local time, and the moment it becomes an instant
 * on a line it starts drifting with whatever timezone parsed it.
 */
export type IsoTime = string;

/**
 * An academic term, as `YYYY.S` — `2023.1` for the first semester of 2023.
 *
 * A term, not a date: a student says they entered in 2023.1, and the day the
 * semester opened is both unknown to them and irrelevant to the enterprise.
 */
export type AcademicTerm = string;

/**
 * Input shape for creating an entity: the id and server-managed fields are
 * assigned by the data source, not by the caller.
 */
export type CreateInput<T extends { id: ID }> = Omit<T, "id" | "createdAt"> &
  Partial<Pick<T, "id">>;
