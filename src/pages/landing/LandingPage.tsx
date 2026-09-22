import { Link } from "react-router-dom";
import { Brand } from "@/components/layout";
import { ThemeToggle } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { MENU_LINKS } from "./constants";
import {
  CallToAction,
  Directorates,
  Faq,
  Hero,
  Highlights,
  HowItWorks,
  KeyQuestions,
  PainPoints,
} from "./sections";

/**
 * The public page, as a table of contents.
 *
 * Each section is its own component in `./sections`: the argument the page
 * makes is eight separate pieces of copy and markup, and reading one of them
 * should not mean scrolling past the other seven.
 */
const LandingPage: React.FC = () => {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-linha bg-papel-alto">
        <div className="env flex h-(--altura-cabecalho) items-center justify-between gap-4">
          <Brand to="/" className="shrink-0 [&_svg]:h-9 sm:[&_svg]:h-12" />

          <nav
            aria-label="Seções da página"
            className="hidden shrink-0 items-center gap-5 lg:flex xl:gap-7"
          >
            {MENU_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm text-tinta-suave no-underline hover:text-violeta"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/*
            Two doors, told apart by weight: the EJ that already uses the system
            signs in, the one arriving for the first time registers. Giving both
            the same emphasis would make the returning member read twice to find
            the one they want.
          */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle compact className="hidden md:flex" />
            <Link
              to={ROUTES.login}
              className="rounded-md px-2 py-2 text-sm font-semibold text-tinta no-underline hover:text-violeta sm:px-3 sm:text-base"
            >
              Entrar
            </Link>
            <Link
              to={ROUTES.signUp}
              className="whitespace-nowrap rounded-md bg-violeta-forte px-3 py-2 text-sm font-semibold text-white no-underline hover:bg-violeta-escuro sm:px-4 sm:text-base"
            >
              Criar cadastro
            </Link>
          </div>
        </div>
      </header>

      <main id="inicio">
        <Hero />
        <KeyQuestions />
        <PainPoints />
        <Highlights />
        <Directorates />
        <HowItWorks />
        <Faq />
        <CallToAction />
      </main>

      <footer className="border-t border-linha bg-papel-alto py-12">
        <div className="env flex flex-wrap items-center justify-between gap-6">
          <div>
            <Brand to="/" />
            <p className="mt-3 mb-0 max-w-[52ch] text-sm leading-relaxed text-tinta-suave">
              Sistema de gestão para empresas juniores. Nascido dentro de uma
              EJ, na UFERSA, Campus Pau dos Ferros.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:items-end">
            <nav aria-label="Links do rodapé" className="flex flex-wrap gap-5">
              {MENU_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-tinta-suave no-underline hover:text-violeta"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <p className="m-0 text-xs text-tinta-suave">
              Desenvolvido por Tobias Fernandes
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export { LandingPage };
