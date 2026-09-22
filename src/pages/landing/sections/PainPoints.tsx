import { PAIN_POINTS } from '../constants'
import { HEADING, SECTION, SECTION_LABEL } from './styles'

export function PainPoints() {
  return (
    <section id="solucao" className={SECTION}>
      <div className="env">
        <p className={SECTION_LABEL}>O que resolve</p>
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-16">
          <h2 className={`m-0 max-w-[24ch] ${HEADING}`}>Os controles do dia a dia, no mesmo lugar.</h2>
          <p className="m-0 max-w-[44ch] self-end text-base leading-relaxed text-tinta-suave">
            Acompanhe contratos, distribua o trabalho e prepare a prestação de
            contas sem reconstruir as informações a cada reunião.
          </p>
        </div>
        <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {PAIN_POINTS.map((item) => (
            <article key={item.title} className="border-t border-linha pt-5">
              <h3 className="mt-0 mb-3 max-w-[25ch] text-md leading-snug">{item.title}</h3>
              <p className="m-0 text-sm leading-relaxed text-tinta-suave">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
