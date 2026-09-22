import { Link } from 'react-router-dom'
import { ArrowRightIcon, ChevronDownIcon } from '@/components/ui/icons'
import { ROUTES } from '@/config/routes'
import { AppPreview } from '../AppPreview'
import { HERO_ASSURANCES } from '../constants'
import { EYEBROW } from './styles'

/** Seção "Capa" da página pública. */
export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-var(--altura-cabecalho))] items-center overflow-hidden border-b border-linha">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(75%_100%_at_50%_0%,var(--violeta-lav)_0%,transparent_72%)]"
      />
  
      <div className="env relative grid items-center gap-12 py-16 lg:grid-cols-[1fr_1.02fr] lg:gap-16 lg:py-10">
        <div>
          <p className={EYEBROW}>Feito para empresas juniores</p>
  
          <h1 className="font-destaque text-[clamp(2.8rem,6.2vw,4.6rem)] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance">
            A gestão da sua empresa júnior{' '}
            <em className="text-violeta not-italic">fora da planilha</em>
          </h1>
  
          <p className="mt-7 max-w-[54ch] text-lg leading-relaxed text-tinta-suave">
            Funil comercial, projetos, horas da equipe, financeiro e indicadores
            em um sistema só. E quando a diretoria troca, o histórico continua
            lá — a gestão que entra começa sabendo onde a anterior parou.
          </p>
  
          <div className="mt-9 flex flex-wrap gap-3">
            {/*
              The hero asks for the commitment, not for a tour: whoever arrives
              here convinced should be able to register the EJ without hunting
              for the way in. "Conhecer o sistema" stays beside it for everyone
              who is not there yet.
            */}
            <Link
              to={ROUTES.signUp}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-violeta-forte px-6 py-3.5 font-semibold text-white no-underline hover:bg-violeta-escuro max-sm:w-full"
            >
              Cadastrar minha EJ
              <ArrowRightIcon size={16} />
            </Link>
            <Link
              to={ROUTES.login}
              className="rounded-md border border-tinta px-6 py-3.5 text-center font-semibold text-tinta no-underline hover:bg-tinta hover:text-papel max-sm:w-full"
            >
              Conhecer o sistema
            </Link>
          </div>
  
          <ul className="mt-8 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm text-tinta-suave">
            {HERO_ASSURANCES.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-verde" />
                {item}
              </li>
            ))}
          </ul>
        </div>
  
        <AppPreview />
      </div>
  
      {/* A full screen hides the fact that there is more below it. */}
      <a
        href="#solucao"
        aria-label="Ver o que o sistema resolve"
        className="absolute inset-x-0 bottom-6 mx-auto hidden w-fit rounded-full border border-linha bg-papel-alto p-2 text-tinta-suave no-underline hover:border-violeta hover:text-violeta lg:block"
      >
        <ChevronDownIcon size={18} />
      </a>
    </section>
  )
}
