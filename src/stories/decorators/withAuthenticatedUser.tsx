import type { Decorator } from '@storybook/react-vite'
import type { User } from '@/domain/types'
import { useAuthStore } from '@/stores/auth'
import { buildSession, presidentUser } from '@/stories/fixtures'

/**
 * Seeds the Zustand auth store so components that read the signed-in user render
 * as they do behind the route guard.
 *
 * The store is set synchronously during the decorator call, before the story
 * mounts, so there is no flash of the anonymous state.
 */
export const withAuthenticatedUser =
  (user: User = presidentUser): Decorator =>
  (Story) => {
    useAuthStore.setState({
      session: buildSession(user),
      status: 'authenticated',
    })

    return <Story />
  }
