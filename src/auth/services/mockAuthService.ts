import { readStoredSession, writeStoredSession } from "@/config/storage";
import type { Session, User } from "@/domain/types";
import { findAccount } from "@/services/mock/accounts";
import { resolveSessionProfile } from "@/services/mock/sessionProfile";
import { AuthError } from "./AuthError";
import { MOCK_SIGN_IN_LATENCY_MS, SESSION_DURATION_MS } from "./constants";
import type { AuthService, Credentials } from "./types";

const delay = () =>
  new Promise((resolve) => setTimeout(resolve, MOCK_SIGN_IN_LATENCY_MS));

/**
 * One door for every account — the seeded demo ones and those registered
 * through sign-up alike. The position is always read from the management the
 * person belongs to, never stored on the account.
 */
function authenticate(email: string, password: string): User {
  const account = findAccount(email);
  if (!account || account.password !== password) {
    throw new AuthError("E-mail ou senha incorretos.");
  }

  const profile = resolveSessionProfile(account.enterpriseId, account.memberId);
  if (!profile) {
    throw new AuthError(
      "Sua conta não tem cargo na gestão vigente. Fale com a presidência da sua EJ.",
    );
  }

  return {
    id: account.id,
    enterpriseId: account.enterpriseId,
    name: account.name,
    email: account.email,
    role: profile.role,
    workAreaId: profile.workAreaId,
    directorates: profile.directorates,
    areaName: profile.areaName,
    avatarUrl: null,
    memberId: account.memberId,
  };
}

export const mockAuthService: AuthService = {
  async signIn({ email, password }: Credentials) {
    await delay();

    const user = authenticate(email, password);

    const session: Session = {
      user,
      accessToken: `demo.${user.id}`,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    writeStoredSession(session);
    return session;
  },

  async completeNewPassword() {
    // Nothing in the demo forces a password change, so `signIn` never throws
    // `NewPasswordRequiredError` and this is never actually called.
    throw new AuthError("Este fluxo não existe na demonstração.");
  },

  async signOut() {
    writeStoredSession(null);
  },

  async restore() {
    const session = readStoredSession();
    if (!session) return null;

    if (session.expiresAt < Date.now()) {
      writeStoredSession(null);
      return null;
    }

    return session;
  },
};
