import { DIRECTORATE_LABELS } from "@/domain/constants";
import { DIRECTORATE_PITCH } from "../constants";
import { HEADING, SECTION, SECTION_LABEL } from "./styles";

const Directorates: React.FC = () => {
  return (
    <section className={SECTION}>
      <div className="env grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className={SECTION_LABEL}>Por diretoria</p>
          <h2 className={`m-0 max-w-[20ch] ${HEADING}`}>
            O trabalho de cada área, conectado.
          </h2>
          <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-tinta-suave">
            Comercial, projetos, financeiro e pessoas trabalham sobre os mesmos
            registros. A presidência acompanha o conjunto.
          </p>
        </div>
        <dl className="m-0 divide-y divide-linha border-y border-linha">
          {DIRECTORATE_PITCH.map((item) => (
            <div
              key={item.directorate}
              className="grid gap-2 py-5 sm:grid-cols-[145px_1fr] sm:gap-6"
            >
              <dt className="text-sm font-semibold">
                {DIRECTORATE_LABELS[item.directorate]}
              </dt>
              <dd className="m-0 text-sm leading-relaxed text-tinta-suave">
                {item.text}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export { Directorates };
