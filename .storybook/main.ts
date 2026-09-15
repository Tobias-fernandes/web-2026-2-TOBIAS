import type { StorybookConfig } from '@storybook/react-vite'

/**
 * Storybook configuration.
 *
 * The Vite config of the app (`vite.config.ts`) is merged in automatically, so
 * the `@/` alias and the Tailwind plugin work here without being repeated.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    // Reads the prop types straight from the TypeScript interfaces in each
    // component's types.ts, so the controls table stays in sync with the code.
    reactDocgen: 'react-docgen-typescript',
  },
}

export default config
