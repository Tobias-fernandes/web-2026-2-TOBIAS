import { useQuery } from "@tanstack/react-query";
import type { ID } from "@/domain/types";
import { dataLayer, type ReportScope } from "@/services";
import { queryKeys } from "./queryKeys";

export function useDashboardMetrics(scope: ReportScope = {}) {
  return useQuery({
    queryKey: queryKeys.reports.dashboard(scope),
    queryFn: () => dataLayer.reports.dashboardMetrics(scope),
  });
}

export function useCycleProgress(cycleId: ID | undefined) {
  return useQuery({
    queryKey: queryKeys.reports.cycleProgress(cycleId ?? ""),
    queryFn: () => dataLayer.reports.cycleProgress(cycleId ?? ""),
    enabled: Boolean(cycleId),
  });
}

export function useWorkloadByMember(scope: ReportScope = {}) {
  return useQuery({
    queryKey: queryKeys.reports.workload(scope),
    queryFn: () => dataLayer.reports.workloadByMember(scope),
  });
}

/**
 * Margin is read per management, never per period: a contract's hours are its
 * whole life. Disabled until the cycle is known, like the other scoped reads.
 */
export function useProjectMargins(cycleId: ID | undefined) {
  return useQuery({
    queryKey: queryKeys.reports.projectMargins(cycleId ?? ""),
    queryFn: () => dataLayer.reports.projectMargins(cycleId),
    enabled: Boolean(cycleId),
  });
}

export function useHoursByCategory(scope: ReportScope = {}) {
  return useQuery({
    queryKey: queryKeys.reports.hoursByCategory(scope),
    queryFn: () => dataLayer.reports.hoursByCategory(scope),
  });
}

export function useFunnel(scope: ReportScope = {}) {
  return useQuery({
    queryKey: queryKeys.reports.funnel(scope),
    queryFn: () => dataLayer.reports.funnel(scope),
  });
}

export function useCashFlow(scope: ReportScope = {}) {
  return useQuery({
    queryKey: queryKeys.reports.cashFlow(scope),
    queryFn: () => dataLayer.reports.cashFlow(scope),
  });
}
