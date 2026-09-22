export interface LoginFormState {
  email: string
  password: string
}

export interface NewPasswordFormState {
  password: string
  confirmation: string
}

export interface LocationStateWithRedirect {
  from?: string
}
