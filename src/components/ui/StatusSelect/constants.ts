import type { Tone } from '@/domain/constants'

export const STATUS_SELECT_TONE_CLASSES: Record<Tone, string> = {
  neutral: 'border-linha bg-papel text-tinta-suave',
  violet: 'border-violeta-lav bg-violeta-lav text-violeta',
  green: 'border-verde-lav bg-verde-lav text-verde',
  amber: 'border-ambar-lav bg-ambar-lav text-ambar',
}
