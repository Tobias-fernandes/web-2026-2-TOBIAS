import type { SignUpFormState } from "../types";

export interface StepProps {
  value: SignUpFormState;
  onChange: (value: SignUpFormState) => void;
}
