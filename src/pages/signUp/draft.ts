import { buildEmptySignUpForm, SIGN_UP_STEPS } from "./constants";
import type { SignUpFormState } from "./types";

/**
 * The sign-up in progress, kept in sessionStorage so an F5 halfway through six
 * steps does not throw the president back to the first one.
 *
 * Session, not local: it lives only as long as the tab, which is all a reload
 * needs, and a registration abandoned on a shared computer does not wait there
 * for the next person. The passwords are never written — they are the one part
 * that must not sit in storage, and retyping them is the cheapest step.
 */
const KEY = "altotech:signup-draft";

interface SignUpDraft {
  form: SignUpFormState;
  stepIndex: number;
}

const withoutPasswords = (form: SignUpFormState): SignUpFormState => ({
  ...form,
  president: { ...form.president, password: "", passwordConfirmation: "" },
});

export function loadSignUpDraft(): SignUpDraft {
  const empty = { form: buildEmptySignUpForm(), stepIndex: 0 };
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return empty;
    const saved = JSON.parse(raw) as SignUpDraft;
    return {
      // Over a fresh form, so a draft saved before a field existed still fills it.
      form: {
        ...empty.form,
        ...saved.form,
        president: { ...empty.form.president, ...saved.form.president },
      },
      stepIndex: Math.min(
        Math.max(0, saved.stepIndex || 0),
        SIGN_UP_STEPS.length - 1,
      ),
    };
  } catch {
    return empty;
  }
}

export function saveSignUpDraft(form: SignUpFormState, stepIndex: number) {
  const draft = { form: withoutPasswords(form), stepIndex };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Most likely the photo pushing past the quota: keep the rest without it.
    try {
      sessionStorage.setItem(
        KEY,
        JSON.stringify({
          ...draft,
          form: {
            ...draft.form,
            president: { ...draft.form.president, avatarUrl: null },
          },
        }),
      );
    } catch {
      // Storage unavailable (private mode, blocked): the form still works.
    }
  }
}

export function clearSignUpDraft() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clear if storage cannot be reached.
  }
}
