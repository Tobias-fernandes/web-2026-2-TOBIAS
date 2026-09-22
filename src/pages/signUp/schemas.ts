import { z } from 'zod'
import { zAcademicTerm, zCnpj, zCpf, zEmail, zPhone, zRequiredText } from '@/lib/validation'

export const enterpriseStepSchema = z.object({
  tradeName: zRequiredText('Informe o nome fantasia da EJ.'),
  cnpj: zCnpj,
  email: zEmail('Informe o e-mail oficial da EJ.'),
})

export const coursesStepSchema = z.object({
  courses: z.array(z.string()).min(1, 'Cadastre ao menos um curso.'),
})

export const areasStepSchema = z.object({
  workAreas: z
    .array(z.object({ name: z.string(), directorate: z.string() }))
    .refine((areas) => areas.some((area) => area.name.trim()), {
      message: 'Cadastre ao menos uma área.',
    }),
})

/** Just the fields, not the password — that is `validateNewPassword`'s job, kept separate. */
export const presidentStepSchema = z.object({
  name: zRequiredText('Informe seu nome completo.'),
  email: zEmail(),
  phone: zPhone,
  cpf: zCpf,
  registration: zRequiredText('Informe sua matrícula.'),
  entryTerm: zAcademicTerm,
  course: zRequiredText('Escolha seu curso.'),
  workArea: zRequiredText('Escolha sua área de atuação.'),
})
