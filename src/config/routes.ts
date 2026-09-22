/**
 * Route paths in one place.
 *
 * Lives in `config` rather than next to the router: pages and the navigation
 * need these strings, and importing them from `app/routes` would close a cycle
 * back through `AppRoutes`, which imports every page.
 *
 * The URLs stay in Portuguese because they are user-facing and already indexed;
 * only the identifiers are in English.
 */
export const ROUTES = {
  landing: '/',
  login: '/login',
  signUp: '/cadastro',
  app: {
    root: '/app',
    cycle: '/app/gestao',
    calendar: '/app/calendario',
    projects: '/app/projetos',
    allocation: '/app/alocacao',
    timeEntries: '/app/horas',
    funnel: '/app/funil',
    clients: '/app/clientes',
    finance: '/app/financeiro',
    members: '/app/membros',
    reports: '/app/relatorios',
    guide: '/app/como-funciona',
  },
} as const
