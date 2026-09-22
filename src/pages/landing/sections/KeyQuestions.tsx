import { KEY_QUESTIONS } from '../constants'

export function KeyQuestions() {
  return (
    <section className="border-b border-linha bg-papel-alto py-12 md:py-16">
      <div className="env grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <h2 className="m-0 max-w-[24ch] font-display text-2xl leading-snug font-semibold">
            Informações que a diretoria precisa ter à mão.
          </h2>
          <p className="mt-4 mb-0 max-w-[42ch] text-sm leading-relaxed text-tinta-suave">
            Respostas que dependem de cruzar projetos, horas e caixa — hoje,
            quase sempre espalhadas em controles diferentes.
          </p>
        </div>
        <ul className="m-0 list-none divide-y divide-linha p-0">
          {KEY_QUESTIONS.map((question) => (
            <li key={question} className="py-4 first:pt-0 last:pb-0">
              <p className="m-0 text-base leading-relaxed">{question}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
