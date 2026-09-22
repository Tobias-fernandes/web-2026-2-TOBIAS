import { FAQ_ITEMS } from "../constants";
import { HEADING, SECTION, SECTION_LABEL } from "./styles";

const Faq: React.FC = () => {
  return (
    <section id="faq" className={SECTION}>
      <div className="env grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div>
          <p className={SECTION_LABEL}>Sobre o sistema</p>
          <h2 className={`m-0 max-w-[18ch] ${HEADING}`}>
            Perguntas frequentes.
          </h2>
          <p className="mt-5 max-w-[32ch] text-md leading-relaxed text-tinta-suave">
            Sobre acesso, rotina da equipe e continuidade entre gestões.
          </p>
        </div>
        <div className="min-w-0 divide-y divide-linha border-y border-linha">
          {FAQ_ITEMS.map((item, index) => (
            <details key={item.question} open={index === 0} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-sans text-base font-semibold group-open:text-violeta [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center  font-sans text-lg font-normal text-tinta-suave after:content-['+'] group-open:text-violeta group-open:after:content-['−']"
                />
              </summary>
              <p className="mt-0 mb-5 max-w-[68ch] pr-4 text-sm leading-relaxed text-tinta-suave">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Faq };
