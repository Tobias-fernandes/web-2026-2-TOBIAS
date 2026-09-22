import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

interface BaseFieldProps {
  label: string;
  hint?: string;
  error?: string;
}

export interface TextFieldProps
  extends BaseFieldProps, InputHTMLAttributes<HTMLInputElement> {}

export interface TextAreaFieldProps
  extends BaseFieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends BaseFieldProps, SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}
