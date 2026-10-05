import { DEMO_ENTERPRISE_ID } from "@/config/storage";
import { describePosition, MEMBER_ROLE_ORDER } from "@/domain/constants";
import type { DemoAccount } from "./accounts";
import {
  SEED_CYCLES,
  SEED_MEMBERS,
  SEED_MEMBERSHIPS,
  SEED_WORK_AREAS,
} from "./seed";
import { profileIn } from "./sessionProfile";

/**
 * Shared password for every demo access. It is shown on the login screen on
 * purpose: this is a showcase, not an access control. Nothing sensitive travels
 * through it, and the whole module is retired once Cognito takes over.
 */
export const DEMO_PASSWORD = "altotech";

/** How the login screen lists one demo access. */
export interface DemoAccess {
  email: string;
  /** "Diretoria · Financeiro" — what signing in as this person will show. */
  position: string;
}

const SEED = {
  cycles: SEED_CYCLES,
  memberships: SEED_MEMBERSHIPS,
  workAreas: SEED_WORK_AREAS,
};

/**
 * One account for every person holding a position in the demo enterprise's
 * current management, so the demo shows what each permission shape sees — the
 * presidency everything, a director writing only in their own area, a project
 * manager reading the whole team's week, a trainee only their own.
 *
 * Ordinary accounts, not a separate kind of user: signing in as one goes
 * through the same lookup as an account registered through sign-up, so the
 * position shown after login is read from the enterprise's data like anyone
 * else's instead of being frozen here.
 */
const seeded = SEED_MEMBERS.flatMap((member) => {
  // Null for whoever holds no position in the open management.
  const profile = profileIn(SEED, member.id);
  if (!profile) return [];

  const account: DemoAccount = {
    // The member's number, so the id is stable across builds.
    id: member.id.replace("mem-", "usr-"),
    enterpriseId: DEMO_ENTERPRISE_ID,
    memberId: member.id,
    name: member.name,
    email: member.email,
    password: DEMO_PASSWORD,
  };
  return [{ account, profile }];
}).sort(
  (a, b) =>
    MEMBER_ROLE_ORDER.indexOf(a.profile.role) -
      MEMBER_ROLE_ORDER.indexOf(b.profile.role) ||
    a.account.name.localeCompare(b.account.name),
);

export const DEMO_ACCOUNTS: DemoAccount[] = seeded.map(
  ({ account }) => account,
);

/** From who sees most to who sees least. */
export const DEMO_ACCESSES: DemoAccess[] = seeded.map(
  ({ account, profile }) => ({
    email: account.email,
    position: describePosition(profile.role, profile.areaName),
  }),
);
