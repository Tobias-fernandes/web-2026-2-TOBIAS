/** `mock` serves the local demo data; `aws` calls the real API and Cognito. */
export type DataSource = 'mock' | 'aws'

export interface CognitoConfig {
  userPoolId: string
  clientId: string
  domain: string
}

export interface AppEnv {
  dataSource: DataSource
  apiUrl: string
  region: string
  cognito: CognitoConfig
  siteUrl: string
}
