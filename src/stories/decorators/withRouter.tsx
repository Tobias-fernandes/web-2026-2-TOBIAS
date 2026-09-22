import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Decorator } from "@storybook/react-vite";

/**
 * Wraps a story in a MemoryRouter, for components that render <Link> or read the
 * current location (Brand, AppLayout, the pages).
 */
export const withRouter: Decorator = (Story) => (
  <MemoryRouter initialEntries={["/app"]}>
    <Story />
  </MemoryRouter>
);

/**
 * Router for components rendered through an <Outlet>, such as AppLayout.
 * The story becomes the child route so the layout has something to show.
 */
export const withOutletRouter =
  (path = "/app"): Decorator =>
  (Story) => (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={<Story />}>
          <Route
            index
            element={
              <p className="text-sm text-tinta-suave">
                Conteúdo da rota renderizado aqui pelo &lt;Outlet&gt;.
              </p>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
