import type { Decorator } from "@storybook/react-vite";

/**
 * Puts every story on the app's paper background with a little breathing room.
 *
 * Applied globally in `.storybook/preview.tsx`, because the components assume
 * the `--color-papel` surface that `body` paints in the real app.
 */
export const withAppSurface: Decorator = (Story) => (
  <div className="bg-papel p-6 text-tinta">
    <Story />
  </div>
);
