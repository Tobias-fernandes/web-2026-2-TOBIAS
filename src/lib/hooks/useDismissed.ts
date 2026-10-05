import { useState } from "react";

function readFlag(key: string | null): boolean {
  if (key === null) return false;
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/**
 * Whether the reader dismissed something, remembered in this browser under
 * `key` — and the function that dismisses it.
 *
 * The key usually arrives late (it names a record still loading) or changes
 * (another management is picked), so the flag is re-read whenever the key
 * does, during render, as React recommends for state derived from a prop.
 * Storage can be missing or blocked; then the dismissal lasts for the visit.
 */
export function useDismissed(key: string | null): [boolean, () => void] {
  const [state, setState] = useState(() => ({ key, dismissed: readFlag(key) }));
  let current = state;
  if (state.key !== key) {
    current = { key, dismissed: readFlag(key) };
    setState(current);
  }

  const dismiss = () => {
    if (key !== null) {
      try {
        localStorage.setItem(key, "1");
      } catch {
        // Not remembered across visits; hidden for now all the same.
      }
    }
    setState({ key, dismissed: true });
  };

  return [current.dismissed, dismiss];
}
