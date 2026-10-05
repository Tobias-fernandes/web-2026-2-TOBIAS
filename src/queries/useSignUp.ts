import { useMutation } from "@tanstack/react-query";
import { onboardingService, type SignUpInput } from "@/services";

/**
 * Registering a junior enterprise.
 *
 * Not invalidating anything on success, unlike every other mutation here: there
 * is no cache to refresh because nothing has been read yet — the session this
 * creates is the first one, and the screens load after it.
 */
export function useSignUp() {
  return useMutation({
    mutationFn: (input: SignUpInput) => onboardingService.signUp(input),
  });
}

/**
 * Whether a CNPJ already has an enterprise, asked when the first step is left
 * so the president learns it before filling in five more.
 *
 * A mutation rather than a query: it is asked once, on demand, for whatever
 * was typed at that moment, and caching the answer would keep telling the
 * form a CNPJ is free after someone else registered it.
 */
export function useCheckCnpj() {
  return useMutation({
    mutationFn: (cnpj: string) => onboardingService.isCnpjTaken(cnpj),
  });
}
