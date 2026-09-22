/**
 * Brazilian document validation, offline.
 *
 * Both CPF and CNPJ carry their own check digits, so a typo is caught here
 * without asking anyone's server — which is the point: a registration form that
 * needs the Receita Federal to be reachable is a form that breaks when it is
 * not. What this cannot say is whether the document *exists* or is active; that
 * is a query against the Receita, and it belongs to the backend.
 */

export const onlyDigits = (value: string): string => value.replace(/\D/g, "");

/**
 * Check digits for documents whose digits are weighted, summed and taken mod 11
 * — the rule both CPF and CNPJ follow, with different weightings.
 */
function checkDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce(
    (total, digit, index) => total + digit * weights[index],
    0,
  );
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 11) return false;
  // Eleven repeated digits satisfy the arithmetic but are not documents.
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const numbers = digits.split("").map(Number);
  const first = checkDigit(numbers.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = checkDigit(
    numbers.slice(0, 10),
    [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return numbers[9] === first && numbers[10] === second;
}

export function isValidCnpj(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const numbers = digits.split("").map(Number);
  const first = checkDigit(
    numbers.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );
  const second = checkDigit(
    numbers.slice(0, 13),
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return numbers[12] === first && numbers[13] === second;
}

export function formatCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

export function formatCnpj(value: string): string {
  const d = onlyDigits(value).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}
