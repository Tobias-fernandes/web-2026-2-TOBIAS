import type { Session } from "@/domain/types";

interface Credentials {
  email: string;
  password: string;
}

/**
 * Resumes a sign-in Cognito paused mid-way.
 *
 * Opaque to everything outside the service that issued it: `LoginPage` only
 * carries it from the failed `signIn` call to `completeNewPassword`, never
 * looks inside. `mockAuthService` never issues one, since nothing in the demo
 * forces a password change.
 */
interface NewPasswordChallenge {
  email: string;
  token: unknown;
}

/**
 * Authentication contract.
 *
 * Implemented today by `mockAuthService` (demo users) and, once the User Pool
 * exists, by `cognitoAuthService`. The auth store only knows this interface.
 */
interface AuthService {
  signIn(credentials: Credentials): Promise<Session>;
  /**
   * Resolves the `NEW_PASSWORD_REQUIRED` challenge Cognito raises for an
   * account an administrator created with a temporary password — its forced
   * first sign-in. `signIn` throws `NewPasswordRequiredError` carrying the
   * challenge to resume here.
   */
  completeNewPassword(
    challenge: NewPasswordChallenge,
    newPassword: string,
  ): Promise<Session>;
  signOut(): Promise<void>;
  /** Persisted session, if still valid. Called once on app start-up. */
  restore(): Promise<Session | null>;
}

export type { AuthService, Credentials, NewPasswordChallenge };
