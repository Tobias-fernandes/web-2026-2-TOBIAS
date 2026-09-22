import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes";

export function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-papel px-5 text-center">
      <div>
        <p className="m-0 font-display text-5xl font-bold text-violeta">404</p>
        <h1 className="mt-3 text-2xl">Página não encontrada</h1>
        <p className="mx-auto mt-2 max-w-[46ch] text-tinta-suave">
          O endereço acessado não existe no AltoTech Manager.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to={ROUTES.landing}
            className="rounded-sm bg-violeta-forte px-5 py-2.5 font-semibold text-white no-underline hover:bg-violeta-escuro"
          >
            Página inicial
          </Link>
          <Link
            to={ROUTES.app.root}
            className="rounded-sm border border-tinta px-5 py-2.5 font-semibold text-tinta no-underline hover:bg-tinta hover:text-papel"
          >
            Ir para o sistema
          </Link>
        </div>
      </div>
    </div>
  );
}
