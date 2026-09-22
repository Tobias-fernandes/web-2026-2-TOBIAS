import { Outlet } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { Sheet } from "@/components/ui";
import { MenuIcon } from "@/components/ui/icons";
import { Brand } from "@/components/layout/Brand";
import { SidebarContent } from "./SidebarContent";
import { useAppLayout } from "./hooks";

const AppLayout: React.FC = () => {
  const { location, menuOpen, setMenuOpen, closeMenu } = useAppLayout();

  return (
    <div className="min-h-dvh bg-papel lg:grid lg:grid-cols-[252px_1fr]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-violeta-forte focus:px-3 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>

      {/* Desktop: a column that is always there. */}
      <aside className="hidden border-r border-linha bg-papel-alto lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="border-b border-linha px-4 py-4">
          <Brand to={ROUTES.app.root} />
        </div>
        <SidebarContent />
      </aside>

      {/* Phone: a bar, and the same menu behind it as a sheet. */}
      <header className="flex items-center justify-between gap-3 border-b border-linha bg-papel-alto px-4 py-3 lg:hidden">
        <Brand to={ROUTES.app.root} />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          className="flex items-center gap-2 rounded-md border border-linha px-3 py-2 text-sm font-medium text-tinta-suave hover:border-tinta hover:text-tinta"
        >
          <MenuIcon size={16} />
          Menu
        </button>
      </header>

      <Sheet open={menuOpen} title="Menu do sistema" onClose={closeMenu}>
        <div className="border-b border-linha px-4 py-4">
          <Brand to={ROUTES.app.root} />
        </div>
        {/*
          Remounted per route so the sheet always opens with the current page
          highlighted, even after a redirect.
        */}
        <SidebarContent key={location.pathname} onNavigate={closeMenu} />
      </Sheet>

      <main
        id="content"
        className="leitura min-w-0 px-5 py-8 lg:px-10 lg:py-10"
      >
        <Outlet />
      </main>
    </div>
  );
};

export { AppLayout };
