import { z } from "zod";
import { zPositiveWholeCount, zRequiredText } from "@/lib/validation";

const MESSAGE =
  "Escolha o membro, o projeto e quantas horas inteiras por semana.";

export const allocationFormSchema = z.object({
  memberId: zRequiredText(MESSAGE),
  projectId: zRequiredText(MESSAGE),
  weeklyHours: zPositiveWholeCount(MESSAGE),
});
