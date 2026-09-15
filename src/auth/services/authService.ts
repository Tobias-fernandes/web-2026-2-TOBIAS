import { isUsingMockData } from '@/config/env'
import { cognitoAuthService } from './cognitoAuthService'
import { mockAuthService } from './mockAuthService'
import type { AuthService } from './types'

/** Follows the same env switch as the data layer: mock for the demo, Cognito on AWS. */
export const authService: AuthService = isUsingMockData
  ? mockAuthService
  : cognitoAuthService
