import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { cycleGoalsFromForm } from "@/lib/cycleGoals";
import { onlyDigits } from "@/lib/document";
import { useSignUp } from "@/queries";
import { useAdoptSession } from "@/stores/auth";
import { toast } from "@/stores/toast";
import { buildEmptySignUpForm, SIGN_UP_STEPS } from "./constants";
import type { SignUpFormState } from "./types";

export function useSignUpPage() {
  const [form, setForm] = useState<SignUpFormState>(buildEmptySignUpForm);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const signUp = useSignUp();
  const adoptSession = useAdoptSession();
  const navigate = useNavigate();

  const step = SIGN_UP_STEPS[stepIndex];
  const isLastStep = stepIndex === SIGN_UP_STEPS.length - 1;

  /** Editing anything clears the complaint: it may no longer be true. */
  function update(next: SignUpFormState) {
    setForm(next);
    setError(null);
  }

  function goBack() {
    setError(null);
    setStepIndex((index) => Math.max(0, index - 1));
  }

  function goNext() {
    const complaint = step.validate(form);
    if (complaint) {
      setError(complaint);
      return;
    }
    setError(null);
    setStepIndex((index) => index + 1);
  }

  async function submit() {
    const complaint = step.validate(form);
    if (complaint) {
      setError(complaint);
      return;
    }

    try {
      const session = await signUp.mutateAsync({
        enterprise: {
          tradeName: form.tradeName,
          cnpj: onlyDigits(form.cnpj),
          email: form.email,
        },
        courses: form.courses,
        workAreas: form.workAreas.filter((area) => area.name.trim()),
        cycleGoals: cycleGoalsFromForm(form.goals),
        president: {
          name: form.president.name,
          email: form.president.email,
          phone: onlyDigits(form.president.phone),
          cpf: onlyDigits(form.president.cpf),
          registration: form.president.registration,
          entryTerm: form.president.entryTerm,
          avatarUrl: form.president.avatarUrl,
          course: form.president.course,
          workArea: form.president.workArea,
          password: form.president.password,
        },
      });

      if (!session) {
        // The API path: the account exists but has to confirm its e-mail before
        // Cognito will sign it in, so the president arrives through the front
        // door like everyone else.
        toast.info("Cadastro enviado. Confirme seu e-mail para poder entrar.");
        navigate(ROUTES.login, { replace: true });
        return;
      }

      // The session already exists — `signUp` built and persisted it — so the
      // store adopts it directly instead of asking `authService` to find it
      // again, which would route through whichever service `VITE_AUTH_SOURCE`
      // currently points at rather than the one that actually just signed in.
      adoptSession(session);
      toast.success("EJ cadastrada! Bem-vindo(a) ao AltoTech Manager.");
      navigate(ROUTES.app.root, { replace: true });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível concluir o cadastro.",
      );
    }
  }

  return {
    form,
    update,
    step,
    stepIndex,
    steps: SIGN_UP_STEPS,
    isLastStep,
    error,
    submitting: signUp.isPending,
    goBack,
    goNext,
    submit,
  };
}

export type SignUpPageState = ReturnType<typeof useSignUpPage>;
