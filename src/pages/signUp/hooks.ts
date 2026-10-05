import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { cycleGoalsFromForm } from "@/lib/cycleGoals";
import { onlyDigits } from "@/lib/document";
import { parseMoneyInput } from "@/lib/money";
import { useCheckCnpj, useSignUp } from "@/queries";
import { useAdoptSession } from "@/stores/auth";
import { toast } from "@/stores/toast";
import { SIGN_UP_STEPS } from "./constants";
import { clearSignUpDraft, loadSignUpDraft, saveSignUpDraft } from "./draft";
import type { CycleStartDraft, SignUpFormState } from "./types";

/** The draft as the service takes it; null when the management starts today. */
const ongoingCycleFrom = (draft: CycleStartDraft) =>
  draft.ongoing
    ? {
        startsAt: draft.startsAt,
        balanceCents: parseMoneyInput(draft.balance) ?? 0,
        contractedRevenueCents: parseMoneyInput(draft.contractedRevenue) ?? 0,
        deliveredProjects: Number(draft.deliveredProjects) || 0,
      }
    : null;

export function useSignUpPage() {
  // Read once, for both: the step only means something with its own form.
  const [draft] = useState(loadSignUpDraft);
  const [form, setForm] = useState<SignUpFormState>(draft.form);
  const [stepIndex, setStepIndex] = useState(draft.stepIndex);
  const [error, setError] = useState<string | null>(null);

  const signUp = useSignUp();
  const checkCnpj = useCheckCnpj();
  const adoptSession = useAdoptSession();
  const navigate = useNavigate();

  const [validating, setValidating] = useState(false);
  const checks = { isCnpjTaken: checkCnpj.mutateAsync };

  useEffect(() => saveSignUpDraft(form, stepIndex), [form, stepIndex]);

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

  /** The current step's complaint, shown in place; true when there is none. */
  async function stepIsValid(): Promise<boolean> {
    setValidating(true);
    try {
      const complaint = await step.validate(form, checks);
      setError(complaint);
      return complaint === null;
    } finally {
      setValidating(false);
    }
  }

  async function goNext() {
    if (await stepIsValid()) setStepIndex((index) => index + 1);
  }

  async function submit() {
    if (!(await stepIsValid())) return;

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
        ongoingCycle: ongoingCycleFrom(form.cycleStart),
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

      // Registered: the draft has done its job either way the session goes.
      clearSignUpDraft();

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
    validating,
    goBack,
    goNext,
    submit,
  };
}

export type SignUpPageState = ReturnType<typeof useSignUpPage>;
