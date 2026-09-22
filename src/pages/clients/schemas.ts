import { z } from "zod";
import { zCnpjOptional, zEmail, zPhone, zRequiredText } from "@/lib/validation";

export const clientFormSchema = z.object({
  name: zRequiredText("Informe ao menos o nome do cliente."),
  // Optional for a lead with no CNPJ yet, but not a half-typed one.
  taxId: zCnpjOptional,
  phone: zPhone,
  email: zEmail(),
});
