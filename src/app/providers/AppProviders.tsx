import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionLoader } from "@/auth/components";
import { queryClient } from "./queryClient";

const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionLoader>{children}</SessionLoader>
    </QueryClientProvider>
  );
};

export { AppProviders };
