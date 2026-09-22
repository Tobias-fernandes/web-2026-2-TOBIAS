import { Link } from 'react-router-dom'
import { Brand } from '@/components/layout'
import { Button, ErrorText } from '@/components/ui'
import { CloseIcon } from '@/components/ui/icons'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'
import { useSignUpPage } from './hooks'
import { AreasStep } from './steps/AreasStep'
import { CoursesStep } from './steps/CoursesStep'
import { EnterpriseStep } from './steps/EnterpriseStep'
import { GoalsStep } from './steps/GoalsStep'
import { PresidentStep } from './steps/PresidentStep'

/**
 * Registering a junior enterprise.
 *
 * Steps rather than one long form, because each asks for a different kind of
 * thing — the company, its courses, its areas, the first management's goals,
 * and the person — and a president who has to fetch the CNPJ should not lose
 * the rest while they look.
 *
 * Nothing is written until the last step is submitted: the enterprise, the
 * president and the first management are created together or not at all.
 */
export function SignUpPage() {
  const page = useSignUpPage()

  return (
    <div className="min-h-dvh bg-papel px-6 py-12">
      <Link
        to={ROUTES.landing}
        aria-label="Voltar para a página inicial"
        className="absolute top-5 right-5 rounded-md p-2 text-tinta-suave no-underline hover:bg-papel-alto hover:text-tinta"
      >
        <CloseIcon size={20} />
      </Link>

      <div className="mx-auto w-full max-w-[640px]">
        <Brand to={ROUTES.landing} className="justify-center" />

        <ol className="mt-9 mb-8 flex list-none gap-2 p-0">
          {page.steps.map((step, index) => (
            <li key={step.id} className="flex-1">
              <span
                className={cn(
                  'block h-1 rounded-full',
                  index <= page.stepIndex ? 'bg-violeta' : 'bg-linha',
                )}
              />
              <span
                className={cn(
                  'mt-2 block text-2xs',
                  index === page.stepIndex
                    ? 'font-semibold text-tinta'
                    : 'text-tinta-suave',
                )}
              >
                {step.title}
              </span>
            </li>
          ))}
        </ol>

        <h1 className="mt-0 mb-1.5 font-display text-xl font-bold">
          {page.step.title}
        </h1>
        <p className="mt-0 mb-7 text-base text-tinta-suave">
          {page.step.description}
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (page.isLastStep) void page.submit()
            else page.goNext()
          }}
          noValidate
          className="flex flex-col gap-4"
        >
          {page.step.id === 'enterprise' && (
            <EnterpriseStep value={page.form} onChange={page.update} />
          )}
          {page.step.id === 'courses' && (
            <CoursesStep value={page.form} onChange={page.update} />
          )}
          {page.step.id === 'areas' && (
            <AreasStep value={page.form} onChange={page.update} />
          )}
          {page.step.id === 'goals' && (
            <GoalsStep value={page.form} onChange={page.update} />
          )}
          {page.step.id === 'president' && (
            <PresidentStep value={page.form} onChange={page.update} />
          )}

          {page.error && <ErrorText>{page.error}</ErrorText>}

          <div className="mt-2 flex items-center justify-between gap-3">
            {page.stepIndex > 0 ? (
              <Button type="button" variant="subtle" onClick={page.goBack}>
                Voltar
              </Button>
            ) : (
              <span />
            )}

            <Button type="submit" disabled={page.submitting}>
              {page.isLastStep
                ? page.submitting
                  ? 'Cadastrando…'
                  : 'Concluir cadastro'
                : 'Continuar'}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-tinta-suave">
          Sua EJ já usa o sistema?{' '}
          <Link to={ROUTES.login} className="font-semibold text-violeta">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
