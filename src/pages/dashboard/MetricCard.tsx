import { Card } from '@/components/ui'
import type { MetricCardProps } from './types'

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <Card className="p-4">
      <p className="m-0 text-[0.76rem] font-semibold tracking-wide text-tinta-suave uppercase">
        {label}
      </p>
      <p className="m-0 mt-1.5 font-display text-2xl font-bold">{value}</p>
      {hint && <p className="m-0 mt-1 text-[0.8rem] text-tinta-suave">{hint}</p>}
    </Card>
  )
}
