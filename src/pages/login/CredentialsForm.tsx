import { DEMO_PASSWORD, DEMO_USERS, isUsingMockAuth } from "@/auth/services";
import type {} from "@/auth/services";
import { Button, ErrorText, TextField } from "@/components/ui";
import { ChevronDownIcon } from "@/components/ui/icons";
import { describePosition } from "@/domain/constants";
import { useCredentialsForm } from "./hooks";
import type { CredentialsFormProps } from "./types";

/** E-mail and password — the door everyone without a pending password change walks through. */
const CredentialsForm: React.FC<CredentialsFormProps> = ({
  redirectTo,
  onChallenge,
}) => {
  const { form, setForm, error, submitting, handleSubmit, fillDemoUser } =
    useCredentialsForm(redirectTo, onChallenge);

  return (
    <>
      <h1 className="mt-9 mb-1.5 text-center font-display text-xl font-bold">
        Acessar o sistema
      </h1>
      <p className="mt-0 mb-8 text-center text-base text-tinta-suave">
        Entre com o e-mail da sua empresa júnior.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          label="E-mail"
          type="email"
          name="email"
          autoComplete="username"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="voce@suaej.com.br"
        />
        <TextField
          label="Senha"
          type="password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          placeholder="******"
          onChange={(event) =>
            setForm({ ...form, password: event.target.value })
          }
        />

        {/*
          The failure is "e-mail ou senha incorretos" — it belongs to the pair,
          not under whichever field the reader happened to touch last.
        */}
        {error && <ErrorText>{error}</ErrorText>}

        <Button type="submit" className="mt-1 w-full" disabled={submitting}>
          {submitting ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      {isUsingMockAuth && (
        <details className="group mt-10 border-t border-linha pt-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm text-tinta-suave hover:text-tinta [&::-webkit-details-marker]:hidden">
            Acessos de demonstração
            <ChevronDownIcon
              size={14}
              className="transition-transform group-open:rotate-180"
            />
          </summary>

          <ul className="m-0 mt-4 flex list-none flex-col p-0">
            {DEMO_USERS.map((demoUser) => (
              <li key={demoUser.id}>
                <button
                  type="button"
                  onClick={() => fillDemoUser(demoUser.email)}
                  className="flex w-full items-baseline justify-between gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-papel-alto hover:text-violeta"
                >
                  <span className="truncate">{demoUser.email}</span>
                  <span className="shrink-0 text-xs text-tinta-suave">
                    {describePosition(demoUser.role, demoUser.directorate)}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-3 mb-0 px-2 text-xs leading-relaxed text-tinta-suave">
            Senha para todos:{" "}
            <code className="rounded bg-papel-alto px-1">{DEMO_PASSWORD}</code>.
            Cada acesso tem um conjunto de permissões diferente.
          </p>
        </details>
      )}
    </>
  );
};

export { CredentialsForm };
