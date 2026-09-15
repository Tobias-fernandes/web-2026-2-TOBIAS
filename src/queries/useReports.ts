import { useQuery } from '@tanstack/react-query'
import { dataLayer, type ReportPeriod } from '@/services'
import { queryKeys } from './queryKeys'

export function useDashboardMetrics(period: ReportPeriod = {}) {
  return useQuery({
    queryKey: queryKeys.reports.dashboard(period),
    queryFn: () => dataLayer.reports.dashboardMetrics(period),
  })
}

export function useHoursByMember(period: ReportPeriod = {}) {
  return useQuery({
    queryKey: queryKeys.reports.hoursByMember(period),
    queryFn: () => dataLayer.reports.hoursByMember(period),
  })
}

export function useHoursByProject(period: ReportPeriod = {}) {
  return useQuery({
    queryKey: queryKeys.reports.hoursByProject(period),
    queryFn: () => dataLayer.reports.hoursByProject(period),
  })
}
