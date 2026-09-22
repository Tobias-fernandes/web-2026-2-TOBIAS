import { ROUTES } from '@/config/routes'

/** Where a user lands after signing in when no protected route sent them here. */
export const DEFAULT_REDIRECT = ROUTES.app.root

export const EMPTY_LOGIN_FORM = {
  email: '',
  password: '',
}

export const EMPTY_NEW_PASSWORD_FORM = {
  password: '',
  confirmation: '',
}
