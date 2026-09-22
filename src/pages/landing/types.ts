import type { Directorate, ProjectStatus } from '@/domain/types'

export interface FaqItem {
  question: string
  answer: string
}

export interface ContentBlock {
  title: string
  text: string
}

export interface MenuLink {
  href: string
  label: string
}

/** What each directorate gets out of the system, in one line. */
export interface DirectoratePitch {
  directorate: Directorate
  text: string
}

export interface PreviewMetric {
  label: string
  value: string
}

export interface BoardPreviewColumn {
  status: ProjectStatus
  cards: { name: string; stage: string }[]
}
