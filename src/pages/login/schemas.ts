import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { zEmail } from "@/lib/validation";

export const loginSchema = z.object({
  email: zEmail(),
  /**
   * Not the full new-password policy — this is an existing account, whatever
   * its password already is — but no real account has one shorter than the
   * app ever let anyone set, so a value under that floor is a mistyped
   * credential, not a legitimate one.
   */
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `A senha precisa de ao menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    ),
});
