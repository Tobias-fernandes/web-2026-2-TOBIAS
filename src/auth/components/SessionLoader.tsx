import { useCallback, useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth";

/**
 * Reads the persisted session once, on app start-up.
 *
 * Lives in a component rather than at module scope so the restore runs inside
 * React's lifecycle and Strict Mode's double effect is harmless — `restore` is
 * idempotent.
 */
const SessionLoader: React.FC<{ children: ReactNode }> = ({ children }) => {
  const restoreSession = useCallback(() => {
    void useAuthStore.getState().restore();
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return <>{children}</>;
};

export { SessionLoader };
