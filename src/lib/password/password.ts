import { z } from "zod";
import { zodValidate } from "@/lib/validation";

/**
 * Client-side password rules, shared by every form that sets one — the
 * president's own password in sign-up, and the forced first-password screen
 * an administrator-created account hits at login.
 *
 * This is a best-effort mirror of the real policy, which lives in the Cognito
 * User Pool and is the only version that actually decides — Cognito still
 * answers with its own `InvalidPasswordException` if this mirror ever drifts
 * from it (see `describePasswordPolicyFailure` in `cognitoAuthService`). One
 * copy of the mirror is what keeps it a single, findable drift risk instead
 * of two independent ones.
 */
export const MIN_PASSWORD_LENGTH = 8;

const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `A senha precisa de ao menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      ),
    confirmation: z.string(),
  })
  .refine((form) => form.password === form.confirmation, {
    message: "As senhas não conferem.",
    path: ["confirmation"],
  });

/** `null` when the password is acceptable; otherwise the reason to show. */
export function validateNewPassword(
  password: string,
  confirmation: string,
): string | null {
  return zodValidate(newPasswordSchema, { password, confirmation });
}
