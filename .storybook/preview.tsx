import type { Preview } from '@storybook/react-vite'
import { withAppSurface } from '../src/stories/decorators'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /(At|Date)$/i,
      },
    },
    a11y: {
      // Reports violations in the a11y panel without failing the story.
      test: 'todo',
    },
    options: {
      storySort: {
        order: ['Documentação', 'UI', 'Layout', 'Páginas'],
      },
    },
  },
  decorators: [withAppSurface],
}

export default preview
