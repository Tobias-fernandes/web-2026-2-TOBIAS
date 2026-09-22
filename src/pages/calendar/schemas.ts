import { z } from 'zod'

export const eventFormSchema = z
  .object({
    title: z.string(),
    startsAt: z.string(),
    endsAt: z.string(),
    allDay: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
  })
  .refine((form) => form.title.trim().length > 0, {
    message: 'Dê um nome ao compromisso.',
    path: ['title'],
  })
  .refine((form) => form.endsAt >= form.startsAt, {
    message: 'O término não pode ser antes do início.',
    path: ['endsAt'],
  })
  .refine((form) => form.allDay || (form.startTime !== '' && form.endTime !== ''), {
    message: 'Informe o horário de início e de término, ou marque "dia todo".',
    path: ['startTime'],
  })
  .refine(
    (form) =>
      form.allDay || form.startsAt !== form.endsAt || form.endTime > form.startTime,
    {
      message: 'O horário de término precisa ser depois do início.',
      path: ['endTime'],
    },
  )
