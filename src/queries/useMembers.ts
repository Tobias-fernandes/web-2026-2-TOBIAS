import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateInput, ID, Member, MemberStatus } from '@/domain/types'
import { dataLayer } from '@/services'
import { queryKeys } from './queryKeys'

export function useMembers() {
  return useQuery({
    queryKey: queryKeys.members.all,
    queryFn: () => dataLayer.members.list(),
  })
}

export function useMember(id: ID) {
  return useQuery({
    queryKey: queryKeys.members.detail(id),
    queryFn: () => dataLayer.members.get(id),
    enabled: Boolean(id),
  })
}

export function useCreateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateInput<Member>) => dataLayer.members.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}

export function useUpdateMemberStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: ID; status: MemberStatus }) =>
      dataLayer.members.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}
