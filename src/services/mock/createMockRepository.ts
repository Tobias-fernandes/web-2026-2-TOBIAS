import type { CreateInput, ID } from '@/domain/types'
import { generateId } from '@/lib/utils'
import type { CrudRepository } from '@/services/types'
import { MOCK_LATENCY_MS } from './constants'
import { readCollectionOrSeed, writeCollection } from './tenantStorage'

const delay = () => new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))

/**
 * Records of the active enterprise, falling back to the seed for the demo one.
 *
 * An EJ that just registered opens an empty system, which is the honest thing
 * to show — its first screen is its own emptiness, not somebody else's
 * projects. `readCollectionOrSeed` is what tells the two cases apart.
 */
function load<T>(collection: string, seed: T[]): T[] {
  return readCollectionOrSeed(collection, seed)
}

interface MockRepositoryOptions<T> {
  key: string
  seed: T[]
  idPrefix: string
  /**
   * Fields the real API would assign on insert, for the entities that have them.
   *
   * Only some entities carry a `createdAt`; others date themselves with their
   * own fields. Stamping unconditionally wrote a property none of those declare.
   */
  stamp?: () => Partial<T>
}

/**
 * In-memory repository persisted to the browser's localStorage.
 *
 * This is the demo implementation of the contracts in `src/services/types`. Once
 * the API is live, VITE_DATA_SOURCE=aws swaps it out — nothing here is imported
 * by a component.
 *
 * Every operation re-reads its collection rather than holding it in a closure:
 * the module loads once, but the enterprise being served changes whenever
 * somebody signs in, and a cached array would keep answering for the last one.
 */
export function createMockRepository<T extends { id: ID }>({
  key,
  seed,
  idPrefix,
  stamp,
}: MockRepositoryOptions<T>): CrudRepository<T> {
  return {
    async list() {
      await delay()
      return structuredClone(load(key, seed))
    },

    async get(id) {
      await delay()
      const records = load(key, seed)
      return structuredClone(records.find((item) => item.id === id) ?? null)
    },

    async create(input: CreateInput<T>) {
      await delay()
      const records = load(key, seed)
      // `CreateInput<T>` plus a generated id is a complete `T`, but TypeScript
      // cannot verify that through the spread of an unresolved generic.
      const created = {
        ...stamp?.(),
        ...input,
        id: input.id ?? generateId(idPrefix),
      } as T
      writeCollection(key, [created, ...records])
      return structuredClone(created)
    },

    async update(id, input) {
      await delay()
      const records = load(key, seed)
      const current = records.find((item) => item.id === id)
      if (!current) throw new Error(`Record ${id} not found.`)
      const updated = { ...current, ...input, id }
      writeCollection(
        key,
        records.map((item) => (item.id === id ? updated : item)),
      )
      return structuredClone(updated)
    },

    async remove(id) {
      await delay()
      const records = load(key, seed)
      writeCollection(
        key,
        records.filter((item) => item.id !== id),
      )
    },
  }
}
