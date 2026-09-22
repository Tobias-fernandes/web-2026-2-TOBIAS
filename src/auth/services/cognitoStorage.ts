import type { ICognitoStorage } from 'amazon-cognito-identity-js'

/**
 * Where the Cognito SDK keeps its own session cache — the refresh, access and
 * id tokens, and which user was last authenticated.
 *
 * `sessionStorage`, not the SDK's default `localStorage`: a token that never
 * touches disk and dies with the tab is a materially smaller prize for
 * anything that manages to run unwanted JavaScript on this page than one
 * sitting in `localStorage` indefinitely, readable by any script, surviving
 * the tab closing, syncable across nothing but still there tomorrow.
 *
 * This is the strongest posture reachable without a backend: the real fix is
 * a token the page's own JavaScript can never read at all, which means the
 * backend's `POST /session` minting an `httpOnly` cookie once it exists. Until
 * then, this is what stands in for it.
 */
export const cognitoStorage: ICognitoStorage = {
  getItem(key) {
    try {
      return sessionStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem(key, value) {
    try {
      sessionStorage.setItem(key, value)
    } catch {
      // Private browsing or blocked storage: the session lives for this call
      // only and will not survive a reload — the same shape of fallback the
      // mock repositories use for the same failure.
    }
  },
  removeItem(key) {
    try {
      sessionStorage.removeItem(key)
    } catch {
      // Nothing to clean up if it was never stored.
    }
  },
  clear() {
    try {
      sessionStorage.clear()
    } catch {
      // Nothing to clean up if nothing was stored.
    }
  },
}
