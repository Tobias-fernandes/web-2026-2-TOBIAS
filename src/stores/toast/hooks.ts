import { useToastStore } from './toastStore'

export const useToasts = () => useToastStore((state) => state.toasts)

export const useDismissToast = () => useToastStore((state) => state.dismiss)
