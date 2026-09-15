/**
 * Route paths in one place.
 *
 * The URLs stay in Portuguese because they are user-facing and already indexed;
 * only the identifiers are in English.
 */
export const ROUTES = {
  landing: '/',
  login: '/login',
  app: {
    root: '/app',
    projects: '/app/projetos',
    timeEntries: '/app/horas',
    clients: '/app/clientes',
    members: '/app/membros',
    reports: '/app/relatorios',
  },
} as const
