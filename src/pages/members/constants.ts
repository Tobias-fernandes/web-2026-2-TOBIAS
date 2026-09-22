import { todayIso } from "@/lib/date";
import type { MemberFormState } from "./types";

/**
 * Opens as an invitation, not as an active member.
 *
 * The board fills in who the person is; the person themselves confirms it. Until
 * that happens the record counts for nothing — which is the difference between
 * registering someone and them having joined.
 */
export const buildEmptyMemberForm = (): MemberFormState => ({
  name: "",
  email: "",
  phone: "",
  cpf: "",
  registration: "",
  entryTerm: "",
  courseId: "",
  avatarUrl: null,
  status: "invited",
  joinedAt: todayIso(),
  role: "trainee",
  workAreaId: "",
  weeklyHours: "8",
});

export const MEMBERS_TABLE_HEADERS = [
  "Membro",
  "Cargo na gestão",
  "Área",
  "Curso",
  "Pactuado",
  "Horas lançadas",
  "Situação",
];
