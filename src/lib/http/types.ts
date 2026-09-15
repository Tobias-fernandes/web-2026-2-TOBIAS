export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Serialized to JSON automatically. */
  body?: unknown
  /** Appended to the URL as a query string, skipping empty values. */
  query?: QueryParams
}
