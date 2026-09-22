import type { NewPasswordChallenge } from "@/auth/services";

export interface LoginFormState {
  email: string;
  password: string;
}

export interface NewPasswordFormState {
  password: string;
  confirmation: string;
}

export interface LocationStateWithRedirect {
  from?: string;
}

export interface CredentialsFormProps {
  redirectTo: string;
  /** `signIn` paused mid-way: the credentials were correct, a new password is needed first. */
  onChallenge: (challenge: NewPasswordChallenge) => void;
}

export interface NewPasswordFormProps {
  challenge: NewPasswordChallenge;
  redirectTo: string;
}
