import { create } from 'zustand'
import { generateId } from '@/lib/utils'
import { TOAST_DURATION_MS } from './constants'
import type { ToastState } from './types'

/**
 * Fire-and-forget notifications, queued rather than replacing one another.
 *
 * Kept in Zustand for the same reason the theme is: `push` needs to be
 * callable from plain `.ts` files — a mutation's `.catch`, a page's hooks
 * file — not just from inside a component's render.
 */
export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],

  push(variant, message) {
    const id = generateId('toast')
    set((state) => ({ toasts: [...state.toasts, { id, variant, message }] }))
    setTimeout(() => get().dismiss(id), TOAST_DURATION_MS[variant])
  },

  dismiss(id) {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
}))
