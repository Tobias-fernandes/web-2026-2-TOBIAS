import { z } from 'zod'
import { zPositiveCount, zRequiredText } from '@/lib/validation'

const MESSAGE = 'Escolha o membro, o projeto e quantas horas por semana.'

export const allocationFormSchema = z.object({
  memberId: zRequiredText(MESSAGE),
  projectId: zRequiredText(MESSAGE),
  weeklyHours: zPositiveCount(MESSAGE),
})
