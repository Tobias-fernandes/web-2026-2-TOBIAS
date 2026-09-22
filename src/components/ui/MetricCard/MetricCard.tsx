import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

export interface MetricCardProps {
  label: string
  value: string
  hint?: ReactNode
}

/** One headline number. The unit of every summary row in the system. */
export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <Card className="p-5">
      <p className="m-0 text-xs font-semibold text-tinta-suave">
        {label}
      </p>
      <p className="m-0 mt-2 font-display text-2xl font-bold">{value}</p>
      {hint && <p className="m-0 mt-1.5 text-sm text-tinta-suave">{hint}</p>}
    </Card>
  )
}
