import type { CreateInput, ID } from '@/domain/types'
import type { CrudRepository } from '@/services/types'
import { MOCK_LATENCY_MS, STORAGE_PREFIX } from './constants'

const delay = () => new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))

function readStored<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? (JSON.parse(raw) as T[]) : fallback
  } catch {
    // Private browsing or blocked storage: fall back to the seed data.
    return fallback
  }
}

function writeStored<T>(key: string, records: T[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(records))
  } catch {
    // No persistence available; records live for this session only.
  }
}

const generateId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export interface MockRepository<T extends { id: ID }> extends CrudRepository<T> {
  /** Current records, without the awaited latency. Used by the report service. */
  snapshot(): T[]
}

/**
 * In-memory repository persisted to the browser's localStorage.
 *
 * This is the demo implementation of the contracts in `src/services/types`. Once
 * the AWS API is live, VITE_DATA_SOURCE=aws swaps it out — nothing here is
 * imported by a component.
 */
export function createMockRepository<T extends { id: ID }>(
  key: string,
  seed: T[],
  idPrefix: string,
): MockRepository<T> {
  let records = readStored<T>(key, seed)

  const persist = () => writeStored(key, records)

  return {
    snapshot: () => records,

    async list() {
      await delay()
      return structuredClone(records)
    },

    async get(id) {
      await delay()
      return structuredClone(records.find((item) => item.id === id) ?? null)
    },

    async create(input: CreateInput<T>) {
      await delay()
      const created = {
        createdAt: new Date().toISOString().slice(0, 10),
        ...input,
        id: input.id ?? generateId(idPrefix),
      } as unknown as T
      records = [created, ...records]
      persist()
      return structuredClone(created)
    },

    async update(id, input) {
      await delay()
      const current = records.find((item) => item.id === id)
      if (!current) throw new Error(`Record ${id} not found.`)
      const updated = { ...current, ...input, id }
      records = records.map((item) => (item.id === id ? updated : item))
      persist()
      return structuredClone(updated)
    },

    async remove(id) {
      await delay()
      records = records.filter((item) => item.id !== id)
      persist()
    },
  }
}

/** Discards demo edits and restores the original seed data. */
export function resetMockData(): void {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    // Storage unavailable: nothing to clear.
  }
}
