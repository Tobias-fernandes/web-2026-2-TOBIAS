export type ID = string

/**
 * Input shape for creating an entity: the id and server-managed fields are
 * assigned by the data source, not by the caller.
 */
export type CreateInput<T extends { id: ID }> = Omit<T, 'id' | 'createdAt'> &
  Partial<Pick<T, 'id'>>
