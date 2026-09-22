import { useToastStore } from "./toastStore";

/**
 * The everyday way to raise a toast: three plain functions, not a hook.
 *
 * Most call sites are inside a mutation's `.catch` or a page's `hooks.ts` —
 * not necessarily mid-render — so `toast.success(...)` reads `getState()`
 * directly instead of asking the caller to be a component that can call
 * `useToastStore()`.
 */
export const toast = {
  success: (message: string) =>
    useToastStore.getState().push("success", message),
  error: (message: string) => useToastStore.getState().push("error", message),
  info: (message: string) => useToastStore.getState().push("info", message),
};

/**
 * A mutation's `onError`, in one line instead of the same ternary at every
 * call site: the data layer's own message when it has one, a generic fallback
 * when the failure carries nothing worth showing.
 */
export function toastMutationError(
  cause: unknown,
  fallback = "Não foi possível concluir a ação.",
): void {
  toast.error(cause instanceof Error ? cause.message : fallback);
}
