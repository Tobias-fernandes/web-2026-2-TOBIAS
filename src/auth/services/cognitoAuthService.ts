import { env } from '@/config/env'
import type { Session } from '@/domain/types'
import { AuthError } from './AuthError'
import type { AuthService, Credentials } from './types'

/**
 * Authentication through Amazon Cognito.
 *
 * Left as an integration point: the interface is already the final one, what is
 * missing is the SDK. To enable it:
 *
 *   1. Create the User Pool and an App Client (no client secret — public app).
 *   2. `npm i aws-amplify` and configure it in `main.tsx`:
 *
 *        import { Amplify } from 'aws-amplify'
 *        Amplify.configure({
 *          Auth: { Cognito: {
 *            userPoolId: env.cognito.userPoolId,
 *            userPoolClientId: env.cognito.clientId,
 *          }},
 *        })
 *
 *   3. Replace the bodies below with `signIn`, `signOut` and `fetchAuthSession`
 *      from 'aws-amplify/auth', mapping the id token claims onto `User`.
 *   4. Register VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID in the
 *      app's environment variables in the Amplify console.
 *
 * Nothing else changes: the auth store only consumes the contract.
 */
function notConfigured(): never {
  throw new AuthError(
    'Cognito ainda não está configurado. Cadastre VITE_COGNITO_USER_POOL_ID e ' +
      'VITE_COGNITO_CLIENT_ID, ou use VITE_DATA_SOURCE=mock para a demonstração.',
  )
}

const isConfigured = () =>
  Boolean(env.cognito.userPoolId && env.cognito.clientId)

export const cognitoAuthService: AuthService = {
  async signIn(_credentials: Credentials): Promise<Session> {
    notConfigured()
  },

  async signOut(): Promise<void> {
    // await signOut()
  },

  async restore(): Promise<Session | null> {
    if (!isConfigured()) return null
    // const session = await fetchAuthSession()
    return null
  },
}
