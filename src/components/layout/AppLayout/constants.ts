import type { NavItem } from './types'

export const APP_NAV_ITEMS: NavItem[] = [
  { to: '/app', label: 'Painel', end: true },
  { to: '/app/projetos', label: 'Projetos' },
  { to: '/app/horas', label: 'Horas' },
  { to: '/app/clientes', label: 'Clientes' },
  { to: '/app/membros', label: 'Membros' },
  { to: '/app/relatorios', label: 'Relatórios' },
]
