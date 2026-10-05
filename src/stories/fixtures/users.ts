import { DEMO_ENTERPRISE_ID } from "@/config/storage";
import type { Session, User } from "@/domain/types";

export const presidentUser: User = {
  id: "usr-1",
  enterpriseId: DEMO_ENTERPRISE_ID,
  name: "Tobias Fernandes",
  email: "tobias@altotech.ej.br",
  role: "president",
  workAreaId: "wka-presidency",
  directorates: ["presidency"],
  areaName: "Presidência",
  avatarUrl: null,
  memberId: "mem-1",
};

export const financeDirectorUser: User = {
  id: "usr-3",
  enterpriseId: DEMO_ENTERPRISE_ID,
  name: "Sofia Lira",
  email: "sofia@altotech.ej.br",
  role: "director",
  workAreaId: "wka-finance",
  directorates: ["finance"],
  areaName: "Financeiro",
  avatarUrl: null,
  memberId: "mem-8",
};

export const traineeUser: User = {
  id: "usr-4",
  enterpriseId: DEMO_ENTERPRISE_ID,
  name: "Beatriz Nogueira",
  email: "beatriz@altotech.ej.br",
  role: "trainee",
  workAreaId: "wka-commercial",
  directorates: ["commercial"],
  areaName: "Comercial",
  avatarUrl: null,
  memberId: "mem-6",
};

export const buildSession = (user: User = presidentUser): Session => ({
  user,
  accessToken: `story.${user.id}`,
  expiresAt: Date.now() + 8 * 60 * 60 * 1000,
});
