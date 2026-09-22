import { useMemo } from 'react'

const UNKNOWN = '—'

/**
 * Resolves an id to a display name in constant time.
 *
 * The rows of a table each need a client or member name, and a `.find()` inside
 * the `.map()` rescans the whole list per row. One index, built when the list
 * changes, reads better and stops the scan.
 */
export function useNameLookup(
  items: readonly { id: string; name: string }[] | undefined,
): (id: string) => string {
  return useMemo(() => {
    const byId = new Map((items ?? []).map((item) => [item.id, item.name]))
    return (id: string) => byId.get(id) ?? UNKNOWN
  }, [items])
}
