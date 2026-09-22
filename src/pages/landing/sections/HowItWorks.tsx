import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ROUTES } from "@/config/routes";
import { HOW_IT_WORKS_STEPS } from "../constants";
import { HEADING, SECTION, SECTION_LABEL } from "./styles";

const HowItWorks: React.FC = () => {
  return (
    <section
      id="funciona"
      className={`border-y border-linha bg-papel-alto ${SECTION}`}
    >
      <div className="env grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="self-start lg:sticky lg:top-28">
          <p className={SECTION_LABEL}>Como funciona</p>
          <h2 className={`m-0 max-w-[22ch] ${HEADING}`}>
            Do início do ano à prestação de contas.
          </h2>
          <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-tinta-suave">
            Abra a gestão, registre a equipe e acompanhe o trabalho. Os
            relatórios usam as informações lançadas na rotina.
          </p>
          <Link
            to={ROUTES.login}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-violeta no-underline hover:underline"
          >
            Ver na demonstração <ArrowRightIcon />
          </Link>
        </div>
        <ol className="m-0 list-none divide-y divide-linha border-t border-linha p-0">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-5 py-6 sm:gap-8">
              <span
                aria-hidden
                className="pt-0.5 font-mono text-xs text-tinta-suave"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mt-0 mb-2 text-md leading-snug">{step.title}</h3>
                <p className="m-0 text-sm leading-relaxed text-tinta-suave">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export { HowItWorks };
