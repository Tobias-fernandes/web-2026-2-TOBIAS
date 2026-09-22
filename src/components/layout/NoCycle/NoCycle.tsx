import { Link } from 'react-router-dom'
import {
  BUTTON_BASE_CLASSES,
  BUTTON_VARIANT_CLASSES,
  EmptyState,
} from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'
import { PageHeader } from '../PageHeader'

/**
 * What the system shows before the EJ has opened its first management.
 *
 * Presentation only: `RequireCycle` decides when it appears. Split that way so
 * this stays a plain screen that Storybook can render without a router full of
 * queries behind it.
 */
export function NoCycle() {
  return (
    <>
      <PageHeader
        title="Nenhuma gestão aberta"
        description="Toda tela do sistema é lida dentro de uma gestão — o ano da diretoria, com metas próprias."
      />

      <EmptyState
        title="Comece abrindo a gestão do ano"
        description="Enquanto ela não existir, não há onde guardar projeto, negociação, lançamento ou compromisso: todo registro daqui pertence a uma gestão."
        action={
          <Link
            to={ROUTES.app.cycle}
            className={cn(
              BUTTON_BASE_CLASSES,
              BUTTON_VARIANT_CLASSES.solid,
              'no-underline',
            )}
          >
            Abrir a gestão
          </Link>
        }
      />
    </>
  )
}
