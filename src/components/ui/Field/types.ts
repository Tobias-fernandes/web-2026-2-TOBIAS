import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import type { SelectProps } from "../Select/types";

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

export interface SelectFieldProps<T extends string>
  extends
    BaseFieldProps,
    Omit<SelectProps<T>, "id" | "invalid" | "labelledBy" | "size"> {}
