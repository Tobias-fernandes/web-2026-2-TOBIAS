import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DEMO_PASSWORD,
  NewPasswordRequiredError,
  type NewPasswordChallenge,
} from "@/auth/services";
import { zodValidate } from "@/lib/validation";
import { validateNewPassword } from "@/lib/password";
import {
  useAuthStore,
  useCompleteNewPassword,
  useCurrentUser,
  useIsRestoringSession,
  useSignIn,
} from "@/stores/auth";
import { toast } from "@/stores/toast";
import {
  DEFAULT_REDIRECT,
  EMPTY_LOGIN_FORM,
  EMPTY_NEW_PASSWORD_FORM,
} from "./constants";
import { loginSchema } from "./schemas";
import type {
  LocationStateWithRedirect,
  LoginFormState,
  NewPasswordFormState,
} from "./types";

/** The shell: which of the two forms to show, and where to land afterwards. */
const useLoginPage = () => {
  const user = useCurrentUser();
  const isRestoring = useIsRestoringSession();
  const location = useLocation();

  const [challenge, setChallenge] = useState<NewPasswordChallenge | null>(null);

  const redirectTo =
    (location.state as LocationStateWithRedirect | null)?.from ??
    DEFAULT_REDIRECT;

  /** Somebody already signed in has no business on this screen. */
  const isSignedIn = !isRestoring && Boolean(user);

  return { challenge, setChallenge, redirectTo, isSignedIn };
};

const useCredentialsForm = (
  redirectTo: string,
  onChallenge: (challenge: NewPasswordChallenge) => void,
) => {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormState>(EMPTY_LOGIN_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const complaint = zodValidate(loginSchema, form);
    if (complaint) {
      setError(complaint);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await signIn(form);
      // `signIn` already resolved the store's `set()` by the time it returns,
      // so the session is there to greet by name instead of a flat "entrou".
      const name = useAuthStore.getState().session?.user.name.split(" ")[0];
      toast.success(name ? `Bem-vindo(a), ${name}!` : "Login realizado.");
      navigate(redirectTo, { replace: true });
    } catch (cause) {
      if (cause instanceof NewPasswordRequiredError) {
        onChallenge(cause.challenge);
      } else {
        setError(
          cause instanceof Error ? cause.message : "Não foi possível entrar.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoUser = (email: string) => {
    setForm({ email, password: DEMO_PASSWORD });
    setError(null);
  };

  return { form, setForm, error, submitting, handleSubmit, fillDemoUser };
};

const useNewPasswordForm = (
  challenge: NewPasswordChallenge,
  redirectTo: string,
) => {
  const completeNewPassword = useCompleteNewPassword();
  const navigate = useNavigate();

  const [form, setForm] = useState<NewPasswordFormState>(
    EMPTY_NEW_PASSWORD_FORM,
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const complaint = validateNewPassword(form.password, form.confirmation);
    if (complaint) {
      setError(complaint);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await completeNewPassword(challenge, form.password);
      toast.success("Senha definida.");
      navigate(redirectTo, { replace: true });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível definir a senha.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { form, setForm, error, submitting, handleSubmit };
};

export { useLoginPage, useCredentialsForm, useNewPasswordForm };
