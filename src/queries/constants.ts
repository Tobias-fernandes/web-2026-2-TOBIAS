/**
 * Demo data answers instantly from localStorage, so a short stale time is enough
 * to dedupe the bursts of requests a page mount causes. Raise it once the AWS
 * API is behind these hooks.
 */
export const DEFAULT_STALE_TIME_MS = 30_000

export const DEFAULT_RETRY_COUNT = 1
