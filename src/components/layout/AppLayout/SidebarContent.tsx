import { Link, NavLink } from "react-router-dom";
import { isUsingMockData } from "@/config/env";
import { ROUTES } from "@/config/routes";
import { describePosition } from "@/domain/constants";
import { cn } from "@/lib/utils";
import { Avatar, Button, ThemeToggle } from "@/components/ui";
import { useSidebarContent } from "./hooks";
import type { SidebarContentProps } from "./types";

/**
 * Navigation and identity, written once.
 *
 * The same markup is the fixed column on a desktop and the contents of the
 * sheet on a phone — two copies of a menu drift apart, and the one nobody is
 * looking at is the one that keeps the removed link.
 */
const SidebarContent: React.FC<SidebarContentProps> = ({ onNavigate }) => {
  const { user, enterprise, groups, handleSignOut } = useSidebarContent();

  return (
    <>
      {/*
        Which EJ this is. Obvious to whoever only ever sees their own — and the
        first thing worth checking for anyone who has signed into two.
      */}
      {enterprise.data && (
        <p className="m-0 border-b border-linha px-4 py-2.5 text-xs font-semibold text-tinta-suave">
          {enterprise.data.tradeName}
        </p>
      )}

      <nav
        aria-label="Seções do sistema"
        className="min-h-0 flex-1 overflow-y-auto px-3 pb-4"
      >
        {groups.map((group, index) => (
          <div
            key={group.label}
            className={cn("py-3", index > 0 && "border-t border-linha")}
          >
            {/*
              The group heading is deliberately the quietest thing in the
              sidebar and the items the loudest: the two used to share a colour,
              which is what made a heading look clickable.
            */}
            <h2 className="mt-0 mb-1.5 px-3 font-sans text-2xs font-semibold tracking-[0.09em] text-tinta-suave uppercase">
              {group.label}
            </h2>

            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-md px-3 py-2 text-base no-underline transition-colors",
                        isActive
                          ? "bg-violeta-lav font-semibold text-violeta"
                          : "font-medium text-tinta hover:bg-papel",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {isUsingMockData && (
          <div className="mt-2 rounded-md border border-linha bg-papel px-3 py-2.5 text-2xs leading-relaxed text-tinta-suave">
            <p className="m-0">
              <strong className="font-semibold text-tinta">
                Dados de demonstração.
              </strong>{" "}
              A API na AWS entra com{" "}
              <code className="rounded bg-papel-alto px-1">
                VITE_DATA_SOURCE
              </code>
              .
            </p>
            <Link
              to={ROUTES.app.guide}
              onClick={onNavigate}
              className="mt-1.5 inline-block font-semibold text-violeta no-underline"
            >
              Zerar e percorrer do zero
            </Link>
          </div>
        )}
      </nav>

      <div className="border-t border-linha p-3">
        <div className="mb-3 flex items-center gap-2.5 px-1">
          <Avatar name={user?.name ?? ""} src={user?.avatarUrl} />
          <div className="min-w-0">
            <p className="m-0 truncate text-sm font-semibold">{user?.name}</p>
            <p className="m-0 truncate text-2xs text-tinta-suave">
              {user ? describePosition(user.role, user.directorate) : ""}
            </p>
          </div>
        </div>

        <ThemeToggle className="mb-2" />

        <Button
          variant="danger"
          onClick={handleSignOut}
          className="w-full py-1.5 text-sm"
        >
          Sair da conta
        </Button>
      </div>
    </>
  );
};

export { SidebarContent };
