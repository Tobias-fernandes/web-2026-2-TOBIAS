import { DEFAULT_REGION } from './constants'
import type { AppEnv, AuthSource, DataSource } from './types'

/**
 * Environment configuration.
 *
 * Every variable is read in one place so it stays obvious what has to be
 * registered in the Amplify console (App settings → Environment variables)
 * once the AWS backend is live.
 */
function readText(value: string | undefined, fallback = ''): string {
  return value?.trim() ? value.trim() : fallback
}

export const env: AppEnv = {
  dataSource: readText(import.meta.env.VITE_DATA_SOURCE, 'mock') as DataSource,
  authSource: readText(import.meta.env.VITE_AUTH_SOURCE, 'mock') as AuthSource,
  apiUrl: readText(import.meta.env.VITE_API_URL),
  region: readText(import.meta.env.VITE_AWS_REGION, DEFAULT_REGION),
  cognito: {
    userPoolId: readText(import.meta.env.VITE_COGNITO_USER_POOL_ID),
    clientId: readText(import.meta.env.VITE_COGNITO_CLIENT_ID),
    domain: readText(import.meta.env.VITE_COGNITO_DOMAIN),
  },
}

/** `true` while the app runs against the demo data instead of the AWS backend. */
export const isUsingMockData = env.dataSource !== 'aws'
