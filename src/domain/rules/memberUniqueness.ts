import type { ID, Member } from "@/domain/types";

/** Stored CPFs are digits only, but a candidate may still carry the mask. */
const digits = (text: string) => text.replace(/\D/g, "");

/**
 * Why a person cannot be registered in this EJ, or null when they can.
 *
 * Unique per enterprise, not across the system: `others` is always one EJ's
 * roster. A student who leaves one junior enterprise and joins another years
 * later is the same CPF in two tenants, and refusing that would lock them out
 * of the second one for having been in the first.
 *
 * Within one EJ the same CPF twice is the same student admitted twice, which
 * splits their hours and positions across two records; the same e-mail twice
 * is two members sharing one sign-in.
 *
 * `exceptId` is the member being edited, so a record never conflicts with
 * itself.
 */
export function memberConflict(
  others: Member[],
  candidate: Pick<Member, "cpf" | "email">,
  exceptId?: ID,
): string | null {
  const cpf = digits(candidate.cpf);
  const email = candidate.email.trim().toLowerCase();
  const rest = others.filter((member) => member.id !== exceptId);

  if (cpf && rest.some((member) => digits(member.cpf) === cpf)) {
    return "Já existe um membro com este CPF nesta EJ.";
  }
  if (
    email &&
    rest.some((member) => member.email.trim().toLowerCase() === email)
  ) {
    return "Já existe um membro com este e-mail nesta EJ.";
  }
  return null;
}
