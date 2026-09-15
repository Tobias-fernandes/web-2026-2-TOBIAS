export interface NavItem {
  to: string
  label: string
  /** Matches the path exactly, so the index route does not stay always active. */
  end?: boolean
}
