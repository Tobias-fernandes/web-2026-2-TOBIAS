import { z } from "zod";
import {
  isValidAcademicTerm,
  isValidBrPhone,
  isValidCnpj,
  isValidCpf,
} from "@/lib/document";
import { parseMoneyInput } from "@/lib/money";

/**
 * Building blocks every form schema in the app is made of.
 *
 * One regex for "is this an e-mail" and one refinement per Brazilian document
 * — reused instead of re-typed per form, so a rule only has one place to be
 * wrong. `.string().email()` is deliberately not used: it accepts an address
 * with no dot in the domain (`a@a`), which is exactly the kind of half-typed
 * value this is meant to catch.
 */

export const zRequiredText = (message: string) =>
  z.string().trim().min(1, message);

export const zEmail = (message = "Informe um e-mail válido.") =>
  z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message);

export const zCpf = z.string().refine(isValidCpf, { message: "CPF inválido." });

export const zCnpj = z
  .string()
  .refine(isValidCnpj, { message: "CNPJ inválido." });

export const zCnpjOptional = z
  .string()
  .refine((value) => !value.trim() || isValidCnpj(value), {
    message: "CNPJ inválido.",
  });

export const zPhone = z
  .string()
  .refine(isValidBrPhone, { message: "Telefone inválido." });

export const zAcademicTerm = z.string().refine(isValidAcademicTerm, {
  message: "Informe o ingresso na faculdade, como 2023.1.",
});

/** A text field holding a money amount, typed in reais, that must be > 0. */
export const zPositiveMoney = (message: string) =>
  z.string().refine((value) => (parseMoneyInput(value) ?? 0) > 0, { message });

/** A text field holding a count or a quantity that must be > 0. */
export const zPositiveCount = (message: string) =>
  z.string().refine((value) => Number(value) > 0, { message });
