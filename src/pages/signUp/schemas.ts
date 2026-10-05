import { z } from "zod";
import { workAreaConflict } from "@/domain/rules";
import type { Directorate } from "@/domain/types";
import { todayIso } from "@/lib/date";
import {
  zAcademicTerm,
  zCnpj,
  zCpf,
  zEmail,
  zNonNegativeMoney,
  zPhone,
  zRequiredMoney,
  zRequiredText,
  zWholeCount,
} from "@/lib/validation";

export const enterpriseStepSchema = z.object({
  tradeName: zRequiredText("Informe o nome fantasia da EJ."),
  cnpj: zCnpj,
  email: zEmail("Informe o e-mail oficial da EJ."),
});

export const coursesStepSchema = z.object({
  courses: z.array(z.string()).min(1, "Cadastre ao menos um curso."),
});

export const areasStepSchema = z.object({
  workAreas: z
    .array(
      z.object({
        name: z.string(),
        directorates: z.array(z.custom<Directorate>()),
      }),
    )
    .superRefine((areas, ctx) => {
      // Rows left without a name are dropped on submit, so they are not
      // checked — only what will actually be saved.
      const named = areas.filter((area) => area.name.trim());
      if (named.length === 0) {
        ctx.addIssue("Cadastre ao menos uma área.");
        return;
      }
      const conflict = workAreaConflict(named);
      if (conflict) ctx.addIssue(conflict);
    }),
});

/**
 * Where a management already running stands. Asked only when the president
 * says it is running — a management that starts now has nothing behind it.
 */
export const ongoingCycleSchema = z.object({
  startsAt: z
    .string()
    .min(1, "Informe o dia em que a diretoria assumiu.")
    .refine((value) => value <= todayIso(), {
      message: "Uma gestão em andamento não pode começar no futuro.",
    }),
  // Required, unlike the goals: a blank balance would silently become zero and
  // every figure on the finance screen would be wrong from day one.
  balance: zRequiredMoney("Informe o saldo em caixa hoje — pode ser 0."),
  contractedRevenue: zNonNegativeMoney(
    "O faturamento de projetos entregues não pode ser negativo.",
  ),
  deliveredProjects: zWholeCount(
    "Os projetos já entregues devem ser um número inteiro e não negativo.",
  ),
});

/** Just the fields, not the password — that is `validateNewPassword`'s job, kept separate. */
export const presidentStepSchema = z.object({
  name: zRequiredText("Informe seu nome completo."),
  email: zEmail(),
  phone: zPhone,
  cpf: zCpf,
  registration: zRequiredText("Informe sua matrícula."),
  entryTerm: zAcademicTerm,
  course: zRequiredText("Escolha seu curso."),
  workArea: zRequiredText("Escolha sua área de atuação."),
});
