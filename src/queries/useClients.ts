import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Client, ClientStatus, CreateInput, ID } from '@/domain/types'
import { dataLayer } from '@/services'
import { queryKeys } from './queryKeys'

export function useClients() {
  return useQuery({
    queryKey: queryKeys.clients.all,
    queryFn: () => dataLayer.clients.list(),
  })
}

export function useClient(id: ID) {
  return useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => dataLayer.clients.get(id),
    enabled: Boolean(id),
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateInput<Client>) => dataLayer.clients.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}

export function useUpdateClientStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: ID; status: ClientStatus }) =>
      dataLayer.clients.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}
