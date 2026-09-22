import { useState } from 'react'
import { isUsingMockData } from '@/config/env'
import { clearDemoData, restoreDemoData } from '@/services/mock'
import type { DemoAction, DemoDataState } from './types'

/**
 * Wiping the demo data, or putting it back.
 *
 * Reaches into `services/mock` rather than through `dataLayer` on purpose: this
 * is the demo adapter's own feature, and there is no AWS counterpart to hide
 * behind the shared contract — against the real API the whole section is gone.
 *
 * Both actions end in a reload. Each repository reads its collection into a
 * closure the first time it is imported, so rewriting localStorage under a
 * running app would leave the screens showing records that no longer exist.
 */
export function useDemoData(): DemoDataState {
  const [confirming, setConfirming] = useState<DemoAction | null>(null)
  const [running, setRunning] = useState(false)

  return {
    available: isUsingMockData,
    confirming,
    running,

    ask: (action) => setConfirming(action),
    dismiss: () => setConfirming(null),

    confirm: () => {
      if (!confirming) return
      setRunning(true)

      if (confirming === 'clear') clearDemoData()
      else restoreDemoData()

      window.location.reload()
    },
  }
}
