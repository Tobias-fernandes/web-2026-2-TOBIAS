import { z } from "zod";
import { zPositiveMoney, zRequiredText } from "@/lib/validation";

const TITLE_AND_CLIENT_MESSAGE =
  "Informe o que está sendo negociado e com qual cliente.";

export const dealFormSchema = z.object({
  title: zRequiredText(TITLE_AND_CLIENT_MESSAGE),
  clientId: zRequiredText(TITLE_AND_CLIENT_MESSAGE),
  value: zPositiveMoney("Informe o valor estimado do negócio, maior que zero."),
});
