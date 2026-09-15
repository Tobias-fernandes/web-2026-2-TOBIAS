import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateInput, ID, Project, ProjectStatus } from '@/domain/types'
import { dataLayer } from '@/services'
import { queryKeys } from './queryKeys'

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: () => dataLayer.projects.list(),
  })
}

export function useProject(id: ID) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => dataLayer.projects.get(id),
    enabled: Boolean(id),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateInput<Project>) => dataLayer.projects.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}

export function useChangeProjectStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: ID; status: ProjectStatus }) =>
      dataLayer.projects.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}
