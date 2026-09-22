import { DEMO_ENTERPRISE_ID } from "@/config/storage";
import type { Course, Member, Membership, WorkArea } from "@/domain/types";
import { activeCycle } from "./cycles";

export const courseList: Course[] = [
  "Tecnologia da Informação",
  "Design Digital",
  "Administração",
].map((name, index) => ({
  id: `crs-${index + 1}`,
  enterpriseId: DEMO_ENTERPRISE_ID,
  name,
  createdAt: "2024-08-05",
}));

export const workAreaList: WorkArea[] = [
  { name: "Presidência", directorate: "presidency" as const },
  { name: "Marketing", directorate: "marketing" as const },
  { name: "Gestão de Projetos", directorate: "projects" as const },
].map((area) => ({
  id: `wka-${area.directorate}`,
  enterpriseId: DEMO_ENTERPRISE_ID,
  name: area.name,
  directorate: area.directorate,
  createdAt: "2024-08-05",
}));

/**
 * Sample people for stories.
 *
 * A member no longer carries a position: it belongs to the term, so the
 * fixtures come in pairs — the person, and the membership that says what they
 * do in 2026.2.
 */
export const presidentMember: Member = {
  id: "mem-1",
  enterpriseId: DEMO_ENTERPRISE_ID,
  name: "Tobias Fernandes",
  email: "tobias@altotech.ej.br",
  phone: "(84) 99612-1180",
  cpf: "10433218100",
  registration: "2022013045",
  entryTerm: "2022.2",
  courseId: courseList[0].id,
  avatarUrl: null,
  status: "active",
  joinedAt: "2024-08-05",
  leftAt: null,
  createdAt: "2024-08-05",
};

export const consultantMember: Member = {
  id: "mem-4",
  enterpriseId: DEMO_ENTERPRISE_ID,
  name: "Júlia Andrade",
  email: "julia@altotech.ej.br",
  phone: "(84) 98120-6634",
  cpf: "02654235114",
  registration: "2024010992",
  entryTerm: "2024.1",
  courseId: courseList[1].id,
  avatarUrl: null,
  status: "active",
  joinedAt: "2025-09-01",
  leftAt: null,
  createdAt: "2025-09-01",
};

export const onLeaveMember: Member = {
  id: "mem-7",
  enterpriseId: DEMO_ENTERPRISE_ID,
  name: "Vinícius Dantas",
  email: "vinicius@altotech.ej.br",
  phone: "(84) 98755-1123",
  cpf: "31034131656",
  registration: "2022007713",
  entryTerm: "2022.1",
  courseId: courseList[2].id,
  avatarUrl: null,
  status: "onLeave",
  joinedAt: "2025-04-22",
  leftAt: null,
  createdAt: "2025-04-22",
};

export const memberList: Member[] = [
  presidentMember,
  consultantMember,
  onLeaveMember,
];

export const presidentMembership: Membership = {
  id: "msh-201",
  memberId: presidentMember.id,
  cycleId: activeCycle.id,
  role: "president",
  workAreaId: workAreaList[0].id,
  weeklyHours: 12,
  startsAt: activeCycle.startsAt,
  endsAt: null,
  createdAt: activeCycle.startsAt,
};

export const consultantMembership: Membership = {
  id: "msh-204",
  memberId: consultantMember.id,
  cycleId: activeCycle.id,
  role: "director",
  workAreaId: workAreaList[1].id,
  weeklyHours: 10,
  startsAt: activeCycle.startsAt,
  endsAt: null,
  createdAt: activeCycle.startsAt,
};

export const membershipList: Membership[] = [
  presidentMembership,
  consultantMembership,
];
