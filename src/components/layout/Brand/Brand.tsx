import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { BrandLockup } from './BrandLockup'

export interface BrandProps {
  to?: string
  className?: string
}

/** Assinatura do produto. Aponta para `/` na página pública e para `/app` dentro do sistema. */
export function Brand({ to = '/', className }: BrandProps) {
  return (
    <Link to={to} className={cn('flex items-center text-tinta no-underline', className)}>
      <BrandLockup className="h-12 w-auto max-w-full" />
    </Link>
  )
}
