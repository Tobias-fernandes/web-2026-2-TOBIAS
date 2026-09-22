import { isUsingMockAuth } from "./authSource";
import { cognitoAuthService } from "./cognitoAuthService";
import { mockAuthService } from "./mockAuthService";
import type { AuthService } from "./types";

/**
 * Its own switch, apart from the data layer's: signing in talks to Cognito
 * directly and needs no backend, so it can go live the day the User Pool
 * exists — independently of whether `VITE_DATA_SOURCE` still points at mock.
 *
 * `isUsingMockAuth` already folds in the local dev toggle on top of
 * `VITE_AUTH_SOURCE` — see `authSource.ts`.
 */
const authService: AuthService = isUsingMockAuth
  ? mockAuthService
  : cognitoAuthService;

export { authService };
