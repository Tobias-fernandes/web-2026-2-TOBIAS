import { HIGHLIGHTS } from '../constants'
import { FeaturePreview } from './FeaturePreview'
import { HEADING, SECTION, SECTION_LABEL } from './styles'

export function Highlights() {
  return (
    <section id="recursos" className={`border-y border-linha bg-papel-alto ${SECTION}`}>
      <div className="env">
        <p className={SECTION_LABEL}>Dentro do sistema</p>
        <h2 className={`m-0 max-w-[26ch] ${HEADING}`}>Uma leitura mais precisa da sua gestão.</h2>
        <p className="mt-5 mb-0 max-w-[64ch] text-base leading-relaxed text-tinta-suave">
          Compare o que foi planejado com o que aconteceu. Do custo de cada
          projeto à disponibilidade da equipe.
        </p>
        <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {HIGHLIGHTS.map((item, index) => (
            <article key={item.title}>
              <div aria-hidden className="overflow-hidden rounded-lg border border-linha">
                <FeaturePreview kind={index} />
              </div>
              <div className="pt-5">
                <h3 className="mt-0 mb-3 text-lg leading-snug">{item.title}</h3>
                <p className="m-0 text-sm leading-relaxed text-tinta-suave">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 mb-0 text-2xs text-tinta-suave">Visualizações ilustrativas com dados de exemplo.</p>
      </div>
    </section>
  )
}
