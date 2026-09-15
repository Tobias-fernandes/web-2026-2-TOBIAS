export interface TimeEntryFormState {
  memberId: string
  projectId: string
  date: string
  hours: string
  description: string
}

export interface TimeEntryFilterState {
  memberId: string
  projectId: string
  from: string
  to: string
}
