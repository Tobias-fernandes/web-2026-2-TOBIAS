import type { Tone } from '@/domain/constants'

export const BADGE_TONE_CLASSES: Record<Tone, string> = {
  neutral: 'bg-papel text-tinta-suave border-linha',
  violet: 'bg-violeta-lav text-violeta border-violeta-lav',
  green: 'bg-verde-lav text-verde border-verde-lav',
  amber: 'bg-ambar-lav text-ambar border-ambar-lav',
}
