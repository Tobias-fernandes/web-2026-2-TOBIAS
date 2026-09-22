/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_SOURCE?: 'mock' | 'aws'
  readonly VITE_AUTH_SOURCE?: 'mock' | 'cognito'
  readonly VITE_API_URL?: string
  readonly VITE_AWS_REGION?: string
  readonly VITE_COGNITO_USER_POOL_ID?: string
  readonly VITE_COGNITO_CLIENT_ID?: string
  readonly VITE_COGNITO_DOMAIN?: string
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
