import { z } from 'zod'
import { zPositiveCount } from '@/lib/validation'

const MESSAGE = 'Informe a quantidade de horas e, para horas de projeto, qual projeto.'

export const timeEntryFormSchema = z
  .object({
    hours: zPositiveCount(MESSAGE),
    category: z.string(),
    projectId: z.string(),
  })
  .refine((form) => form.category !== 'project' || form.projectId !== '', {
    message: MESSAGE,
    path: ['projectId'],
  })
