import { Route, Routes } from 'react-router-dom'
import { RequireAuth } from '@/auth/components'
import { AppLayout } from '@/components/layout'
import {
  ClientsPage,
  DashboardPage,
  LandingPage,
  LoginPage,
  MembersPage,
  NotFoundPage,
  ProjectsPage,
  ReportsPage,
  TimeEntriesPage,
} from '@/pages'

/**
 * Route map.
 *
 * `/` is the public page indexed by Google; everything under `/app` is the
 * system and requires a session. Amplify needs the `/<*>` → `/index.html` (200)
 * rewrite rule so reloading on an inner route does not return a 404.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projetos" element={<ProjectsPage />} />
          <Route path="horas" element={<TimeEntriesPage />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="membros" element={<MembersPage />} />
          <Route path="relatorios" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
