/** `mock` serves the local demo data; `aws` calls the real API. */
export type DataSource = "mock" | "aws";

/**
 * `mock` signs in against the fixed demo users; `cognito` performs a real SRP
 * sign-in against the User Pool.
 *
 * Kept apart from `DataSource` on purpose: signing in talks to Cognito directly
 * and needs no backend, while every other screen still needs `VITE_API_URL` to
 * exist. Coupling the two under one switch would mean the login screen could
 * only be tested once the API was live — this way it can be tested the day the
 * User Pool exists.
 */
export type AuthSource = "mock" | "cognito";

export interface CognitoConfig {
  userPoolId: string;
  clientId: string;
  domain: string;
}

export interface AppEnv {
  dataSource: DataSource;
  authSource: AuthSource;
  apiUrl: string;
  region: string;
  cognito: CognitoConfig;
}
