export { authService } from "./authService";
export { mockAuthService } from "./mockAuthService";
export { cognitoAuthService } from "./cognitoAuthService";
export {
  activeAuthSource,
  isUsingMockAuth,
  writeDevAuthOverride,
} from "./authSource";
export { AuthError } from "./AuthError";
export { NewPasswordRequiredError } from "./NewPasswordRequiredError";
export { SESSION_DURATION_MS } from "./constants";
export {
  DEMO_ACCESSES,
  DEMO_PASSWORD,
  type DemoAccess,
} from "@/services/mock/demoAccounts";
export type { AuthService, Credentials, NewPasswordChallenge } from "./types";
