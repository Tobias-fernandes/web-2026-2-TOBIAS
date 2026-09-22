import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@/components/ui/icons'
import { ROUTES } from '@/config/routes'
import { HEADING, SECTION } from './styles'

export function CallToAction() {
  return (
    <section className={`border-t border-linha bg-papel-alto ${SECTION}`}>
      <div className="env grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div>
          <h2 className={`m-0 ${HEADING}`}>Conheça antes de começar.</h2>
          <p className="mt-4 mb-0 max-w-[56ch] text-base leading-relaxed text-tinta-suave">
            Acesse a demonstração e percorra o sistema com os dados de uma EJ
            fictícia. Gratuito, direto no navegador.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-center">
          <Link to={ROUTES.login} className="inline-flex items-center justify-center gap-3 rounded-md bg-violeta-forte px-6 py-3 text-sm font-semibold text-white no-underline hover:bg-violeta-escuro">
            Acessar demonstração <ArrowRightIcon size={16} />
          </Link>
          <Link to={ROUTES.signUp} className="text-sm text-tinta-suave underline decoration-linha underline-offset-4 hover:text-violeta">
            Cadastrar minha empresa júnior
          </Link>
        </div>
      </div>
    </section>
  )
}
