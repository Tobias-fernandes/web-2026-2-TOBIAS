import { z } from "zod";
import {
  zPositiveCount,
  zPositiveMoney,
  zRequiredText,
} from "@/lib/validation";

const NAME_AND_CLIENT_MESSAGE =
  "Informe ao menos o nome do projeto e o cliente.";

export const projectFormSchema = z.object({
  name: zRequiredText(NAME_AND_CLIENT_MESSAGE),
  clientId: zRequiredText(NAME_AND_CLIENT_MESSAGE),
  contractValue: zPositiveMoney(
    "Informe um valor de contrato válido, maior que zero.",
  ),
  estimatedHours: zPositiveCount("Informe as horas orçadas, maior que zero."),
});
