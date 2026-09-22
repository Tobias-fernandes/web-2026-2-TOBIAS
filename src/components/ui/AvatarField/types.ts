export interface AvatarFieldProps {
  label: string
  /** Whose picture this is: drives the initials shown while there is none. */
  name: string
  value: string | null
  onChange: (value: string | null) => void
}
