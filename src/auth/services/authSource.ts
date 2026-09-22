import { env } from "@/config/env";
import type { AuthSource } from "@/config/env";

const DEV_AUTH_OVERRIDE_KEY = "altotech:dev-auth-override";

const readDevOverride: () => AuthSource | null = () => {
  try {
    const value = localStorage.getItem(DEV_AUTH_OVERRIDE_KEY);
    return value === "mock" || value === "cognito" ? value : null;
  } catch {
    return null;
  }
};

/** Sets or clears the manual override. Dev-only — see `activeAuthSource`. */
const writeDevAuthOverride: (source: AuthSource | null) => void = (source) => {
  try {
    if (source) localStorage.setItem(DEV_AUTH_OVERRIDE_KEY, source);
    else localStorage.removeItem(DEV_AUTH_OVERRIDE_KEY);
  } catch {
    // No persistence; the toggle only lasts until the tab closes anyway.
  }
};

/**
 * Which auth source is actually active, resolved once per page load.
 *
 * `VITE_AUTH_SOURCE` decides it everywhere except local development, where a
 * manual override — set from the login screen's toggle, so both the real
 * Cognito flow and the fixed demo accounts can be tested without a rebuild —
 * takes precedence. `import.meta.env.DEV` is statically `false` in a
 * production build, so this whole branch, the toggle component and the
 * override storage are dead code there: there is no way for a shipped build
 * to run with the wrong auth source because of a stray `localStorage` value.
 */
const activeAuthSource: AuthSource = import.meta.env.DEV
  ? (readDevOverride() ?? env.authSource)
  : env.authSource;

/** `true` while sign-in runs against the fixed demo users instead of Cognito. */
const isUsingMockAuth = activeAuthSource !== "cognito";

export { activeAuthSource, isUsingMockAuth, writeDevAuthOverride };
