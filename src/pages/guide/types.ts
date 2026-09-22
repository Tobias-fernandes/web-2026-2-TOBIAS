import type { Directorate } from '@/domain/types'

export interface FlowStep {
  title: string
  text: string
  /** Where in the system the step happens. */
  route: string
  routeLabel: string
}

export interface DirectorateGuide {
  directorate: Directorate
  does: string
  screens: { label: string; to: string }[]
}

export interface RoutineItem {
  when: string
  who: string
  what: string
}

export interface Concept {
  term: string
  meaning: string
}

export type RoadmapStatus = 'done' | 'building' | 'planned'

export interface RoadmapPhase {
  status: RoadmapStatus
  title: string
  summary: string
  items: string[]
}

/** Which way the demo data is being reset. */
export type DemoAction = 'clear' | 'restore'

export interface DemoDataState {
  /** Hidden against the real API: there is no demo there to reset. */
  available: boolean
  confirming: DemoAction | null
  ask: (action: DemoAction) => void
  dismiss: () => void
  confirm: () => void
  running: boolean
}

/** One stop of the walkthrough, in the order an empty system has to be filled. */
export interface ZeroStep {
  route: string
  routeLabel: string
  what: string
}
