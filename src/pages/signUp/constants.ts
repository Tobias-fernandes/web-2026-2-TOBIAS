import type { Directorate } from "@/domain/types";
import { buildEmptyCycleGoalsForm, validateCycleGoals } from "@/lib/cycleGoals";
import { onlyDigits } from "@/lib/document";
import { validateNewPassword } from "@/lib/password";
import { zodValidate } from "@/lib/validation";
import {
  areasStepSchema,
  coursesStepSchema,
  ongoingCycleSchema,
  enterpriseStepSchema,
  presidentStepSchema,
} from "./schemas";
import type { SignUpChecks, SignUpFormState, SignUpStep } from "./types";

/**
 * Asked when the first step is left, so the president learns the CNPJ is taken
 * before filling in five more. A courtesy: if the question cannot be asked,
 * the president goes on and the final submit refuses a taken CNPJ all the same.
 */
async function takenCnpjComplaint(
  cnpj: string,
  isCnpjTaken: SignUpChecks["isCnpjTaken"],
): Promise<string | null> {
  try {
    return (await isCnpjTaken(onlyDigits(cnpj)))
      ? "Este CNPJ já tem uma empresa júnior cadastrada."
      : null;
  } catch {
    return null;
  }
}

/**
 * Areas an EJ is offered to start from.
 *
 * Suggestions, not a fixed list: the names can be changed and rows removed, and
 * what is kept is only the mapping underneath, which is what the permissions
 * read. An EJ that calls its people area "Gente e Gestão" should not have to
 * accept somebody else's vocabulary to use the system.
 */
export const SUGGESTED_WORK_AREAS: SignUpFormState["workAreas"] = [
  { name: "Presidência", directorates: ["presidency"] },
  { name: "Vice-presidência", directorates: ["vicePresidency"] },
  { name: "Comercial", directorates: ["commercial"] },
  { name: "Marketing", directorates: ["marketing"] },
  { name: "Gestão de Pessoas", directorates: ["people"] },
  { name: "Financeiro", directorates: ["finance"] },
  { name: "Projetos", directorates: ["projects"] },
];

/** Ready-made layouts, for the two ways most EJs are organised. */
export const WORK_AREA_PRESETS: {
  label: string;
  areas: SignUpFormState["workAreas"];
}[] = [
  { label: "Cada área separada", areas: SUGGESTED_WORK_AREAS },
  {
    label: "Comercial e Marketing juntos",
    areas: [
      { name: "Presidência", directorates: ["presidency"] },
      { name: "Vice-presidência", directorates: ["vicePresidency"] },
      {
        name: "Comercial e Marketing",
        directorates: ["commercial", "marketing"],
      },
      { name: "Gestão de Pessoas", directorates: ["people"] },
      { name: "Financeiro", directorates: ["finance"] },
      { name: "Projetos", directorates: ["projects"] },
    ],
  },
];

/**
 * What directing each function lets a director do, in the words of the screens
 * it opens — so choosing where a function goes is a choice about people, not
 * about an internal code.
 */
export const DIRECTORATE_HINTS: Record<Directorate, string> = {
  presidency: "acesso a todas as telas",
  vicePresidency: "acesso a todas as telas",
  commercial: "clientes e negociações",
  marketing: "clientes e negociações",
  people: "membros e cargos da gestão",
  finance: "caixa, contas a pagar e a receber",
  projects: "projetos, alocação e horas da equipe",
};

export const buildEmptySignUpForm = (): SignUpFormState => ({
  tradeName: "",
  cnpj: "",
  email: "",
  courses: [],
  workAreas: [...SUGGESTED_WORK_AREAS],
  cycleStart: {
    ongoing: null,
    startsAt: "",
    balance: "",
    contractedRevenue: "",
    deliveredProjects: "",
  },
  goals: buildEmptyCycleGoalsForm(),
  president: {
    name: "",
    email: "",
    phone: "",
    cpf: "",
    registration: "",
    entryTerm: "",
    course: "",
    workArea: "",
    avatarUrl: null,
    password: "",
    passwordConfirmation: "",
  },
});

export const SIGN_UP_STEPS: SignUpStep[] = [
  {
    id: "enterprise",
    title: "A empresa júnior",
    description: "Como a EJ se chama e por onde ela responde oficialmente.",
    validate: async (form, { isCnpjTaken }) =>
      zodValidate(enterpriseStepSchema, form) ??
      (await takenCnpjComplaint(form.cnpj, isCnpjTaken)),
  },
  {
    id: "courses",
    title: "Cursos",
    description:
      "De quais cursos a EJ aceita membros. Só alunos destes cursos podem ser cadastrados.",
    validate: (form) => zodValidate(coursesStepSchema, form),
  },
  {
    id: "areas",
    title: "Áreas de atuação",
    description:
      "Como a EJ se divide por dentro: áreas separadas ou juntas, do jeito que ela funciona hoje.",
    validate: (form) => zodValidate(areasStepSchema, form),
  },
  {
    id: "cycleStart",
    title: "Momento da gestão",
    description:
      "Se a diretoria já está no meio do mandato, o sistema começa de onde ela está — não do zero.",
    validate: ({ cycleStart }) => {
      if (cycleStart.ongoing === null) {
        return "Diga se a gestão já está em andamento.";
      }
      return cycleStart.ongoing
        ? zodValidate(ongoingCycleSchema, cycleStart)
        : null;
    },
  },
  {
    id: "goals",
    title: "Metas da gestão",
    description:
      "O que a diretoria deste ano se compromete a entregar. Pode deixar em branco e ajustar depois — zero também é uma meta válida.",
    validate: (form) => validateCycleGoals(form.goals),
  },
  {
    id: "president",
    title: "Quem preside",
    description: "Seus dados. Esta é a conta que vai administrar o sistema.",
    validate: (form) =>
      zodValidate(presidentStepSchema, form.president) ??
      validateNewPassword(
        form.president.password,
        form.president.passwordConfirmation,
      ),
  },
];
