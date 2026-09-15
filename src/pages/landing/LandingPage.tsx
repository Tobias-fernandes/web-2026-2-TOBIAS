import { Link } from 'react-router-dom'
import { Brand } from '@/components/layout'
import {
  FAQ_ITEMS,
  HOW_IT_WORKS_STEPS,
  MENU_LINKS,
  PAIN_POINTS,
  REPOSITORY_URL,
} from './constants'
import { ProjectBoardPreview } from './ProjectBoardPreview'

export function LandingPage() {
  return (
    <>
      <header className="border-b border-linha bg-papel-alto">
        <div className="env flex items-center justify-between gap-4 py-3.5">
          <Brand to="/" />
          <nav aria-label="Seções da página" className="hidden gap-6 sm:flex">
            {MENU_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.95rem] text-tinta-suave no-underline hover:text-violeta"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <Link
            to="/login"
            className="rounded-[4px] bg-violeta px-4 py-2 text-[0.9rem] font-semibold text-white no-underline hover:bg-violeta-escuro"
          >
            Acessar o sistema
          </Link>
        </div>
      </header>

      <main id="inicio">
        <section className="border-b border-linha py-14 md:py-[4.5rem]">
          <div className="env grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <h1 className="text-[clamp(2.3rem,5.2vw,3.9rem)] leading-[1.03]">
                A gestão da sua empresa júnior fora da planilha
              </h1>
              <p className="mt-5 max-w-[64ch] text-[1.12rem] text-tinta-suave">
                O AltoTech Manager reúne projetos, horas de membros, clientes e
                indicadores em um só lugar, para a diretoria parar de reconstruir
                o mesmo controle a cada troca de gestão.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="rounded-[4px] bg-violeta px-5 py-3 font-semibold text-white no-underline hover:bg-violeta-escuro"
                >
                  Entrar no sistema
                </Link>
                <a
                  href={REPOSITORY_URL}
                  className="rounded-[4px] border border-tinta px-5 py-3 font-semibold text-tinta no-underline hover:bg-tinta hover:text-papel-alto"
                >
                  Ver o código no GitHub
                </a>
              </div>
            </div>

            <ProjectBoardPreview />
          </div>
        </section>

        <section id="solucao" className="border-b border-linha py-14">
          <div className="env">
            <h2 className="mb-8 max-w-[22ch] text-[clamp(1.6rem,3.2vw,2.2rem)]">
              Quatro controles que toda EJ improvisa
            </h2>
            <div className="grid gap-9 md:grid-cols-2 md:gap-x-12">
              {PAIN_POINTS.map((item) => (
                <div key={item.title} className="border-l-2 border-violeta pl-4">
                  <h3 className="mb-1.5 text-[1.04rem]">{item.title}</h3>
                  <p className="m-0 text-[0.96rem] text-tinta-suave">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="funciona" className="border-b border-linha py-14">
          <div className="env">
            <h2 className="mb-8 max-w-[22ch] text-[clamp(1.6rem,3.2vw,2.2rem)]">
              Como funciona
            </h2>
            <ol className="grid max-w-[70ch] list-none gap-7 p-0">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[auto_1fr] items-start gap-4"
                >
                  <span
                    aria-hidden
                    className="grid size-8 place-items-center rounded-full border border-tinta font-display text-[0.9rem] font-bold"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="mb-1 text-[1.02rem]">{step.title}</h3>
                    <p className="m-0 text-[0.96rem] text-tinta-suave">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="faq" className="border-b border-linha py-14">
          <div className="env">
            <h2 className="mb-8 max-w-[22ch] text-[clamp(1.6rem,3.2vw,2.2rem)]">
              Perguntas frequentes
            </h2>
            <div className="max-w-[72ch]">
              {FAQ_ITEMS.map((item, index) => (
                <details
                  key={item.question}
                  open={index === 0}
                  className="group border-b border-linha py-4"
                >
                  <summary className="flex cursor-pointer list-none justify-between gap-4 font-display text-[1.03rem] font-bold group-open:text-violeta [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span
                      aria-hidden
                      className="font-medium text-tinta-suave after:content-['+'] group-open:after:content-['–']"
                    />
                  </summary>
                  <p className="mt-3 mb-0 text-[0.97rem] text-tinta-suave">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 text-[0.9rem] text-tinta-suave">
        <div className="env">
          <p className="max-w-[70ch]">
            AltoTech Manager — projeto da disciplina de Desenvolvimento Web,
            Bacharelado em Tecnologia da Informação, UFERSA, Campus Pau dos
            Ferros.
          </p>
          <p className="m-0 max-w-[70ch]">
            Desenvolvido por Tobias Fernandes ·{' '}
            <a href={REPOSITORY_URL} className="text-violeta">
              github.com/Tobias-fernandes/web-2026-2-TOBIAS
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
