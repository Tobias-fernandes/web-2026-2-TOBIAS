import { useMutation, useQuery } from '@tanstack/react-query'
import type { CreateInput, ID } from '@/domain/types'
import type { CrudRepository } from '@/services'

interface EntityKeys {
  all: readonly string[]
  detail: (id: string) => readonly string[]
}

/**
 * The five hooks every register shares, bound to one repository.
 *
 * Clients, members, projects and time entries all read and write through the
 * same `CrudRepository` contract, so their hook modules were the same file three
 * times over. Cache invalidation is not repeated here either — the QueryClient
 * applies it to every mutation by default (see `app/providers/queryClient`).
 */
export function createEntityQueries<T extends { id: ID }>(
  keys: EntityKeys,
  repository: CrudRepository<T>,
) {
  return {
    useList: () =>
      useQuery({ queryKey: keys.all, queryFn: () => repository.list() }),

    useDetail: (id: ID) =>
      useQuery({
        queryKey: keys.detail(id),
        queryFn: () => repository.get(id),
        enabled: Boolean(id),
      }),

    useCreate: () =>
      useMutation({
        mutationFn: (input: CreateInput<T>) => repository.create(input),
      }),

    useUpdate: () =>
      useMutation({
        mutationFn: ({ id, input }: { id: ID; input: Partial<T> }) =>
          repository.update(id, input),
      }),

    useRemove: () => useMutation({ mutationFn: (id: ID) => repository.remove(id) }),
  }
}
