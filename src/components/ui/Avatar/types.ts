export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  name: string
  /** Picture URL when there is one — the `picture` claim of the id token. */
  src?: string | null
  size?: AvatarSize
  className?: string
}
