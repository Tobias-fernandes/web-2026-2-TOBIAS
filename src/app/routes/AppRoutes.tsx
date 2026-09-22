import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/auth/components";
import { RequireCycle } from "./RequireCycle";
import { AppLayout } from "@/components/layout";
import { ROUTES } from "@/config/routes";
import {
  AllocationPage,
  CalendarPage,
  ClientsPage,
  CyclePage,
  DashboardPage,
  FinancePage,
  FunnelPage,
  GuidePage,
  LandingPage,
  LoginPage,
  MembersPage,
  NotFoundPage,
  ProjectsPage,
  ReportsPage,
  SignUpPage,
  TimeEntriesPage,
} from "@/pages";

/**
 * Route map.
 *
 * `/` is the public page indexed by Google; everything under `/app` is the
 * system and requires a session. Amplify needs the `/<*>` → `/index.html` (200)
 * rewrite rule so reloading on an inner route does not return a 404.
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.landing} element={<LandingPage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.signUp} element={<SignUpPage />} />

      <Route element={<RequireAuth />}>
        <Route path={ROUTES.app.root} element={<AppLayout />}>
          <Route path={ROUTES.app.cycle} element={<CyclePage />} />
          <Route path={ROUTES.app.clients} element={<ClientsPage />} />
          <Route path={ROUTES.app.timeEntries} element={<TimeEntriesPage />} />
          <Route path={ROUTES.app.guide} element={<GuidePage />} />

          <Route element={<RequireCycle />}>
            <Route index element={<DashboardPage />} />
            <Route path={ROUTES.app.calendar} element={<CalendarPage />} />
            <Route path={ROUTES.app.projects} element={<ProjectsPage />} />
            <Route path={ROUTES.app.allocation} element={<AllocationPage />} />
            <Route path={ROUTES.app.funnel} element={<FunnelPage />} />
            <Route path={ROUTES.app.finance} element={<FinancePage />} />
            <Route path={ROUTES.app.members} element={<MembersPage />} />
            <Route path={ROUTES.app.reports} element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export { AppRoutes };
