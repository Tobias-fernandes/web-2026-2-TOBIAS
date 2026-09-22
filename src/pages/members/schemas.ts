import { z } from "zod";
import {
  zAcademicTerm,
  zCpf,
  zEmail,
  zPhone,
  zPositiveCount,
  zRequiredText,
} from "@/lib/validation";

export const memberFormSchema = z.object({
  name: zRequiredText("Informe o nome do membro."),
  email: zEmail(),
  phone: zPhone,
  cpf: zCpf,
  registration: zRequiredText("Informe a matrícula."),
  entryTerm: zAcademicTerm,
  courseId: zRequiredText("Escolha o curso."),
  workAreaId: zRequiredText("Escolha a área de atuação."),
  weeklyHours: zPositiveCount(
    "Informe a carga horária semanal, maior que zero.",
  ),
});
