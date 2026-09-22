export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
}

export interface ToastState {
  toasts: Toast[];
  push: (variant: ToastVariant, message: string) => void;
  dismiss: (id: string) => void;
}
