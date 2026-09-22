import { z } from 'zod'
import { zPositiveMoney, zRequiredText } from '@/lib/validation'

const MESSAGE = 'Informe a descrição e um valor maior que zero.'

export const financeFormSchema = z.object({
  description: zRequiredText(MESSAGE),
  amount: zPositiveMoney(MESSAGE),
})
