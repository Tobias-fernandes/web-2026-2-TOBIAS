import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "@/stories/decorators";
import { Brand } from "./Brand";

const meta = {
  title: "Layout/Brand",
  component: Brand,
  tags: ["autodocs"],
  decorators: [withRouter],
  parameters: {
    docs: {
      description: {
        component:
          "Assinatura do produto. Aponta para `/` na página pública e para `/app` dentro do sistema.",
      },
    },
  },
  args: { to: "/" },
} satisfies Meta<typeof Brand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

/** Centralizada, como aparece acima do formulário de login. */
export const Centralizada: Story = {
  args: { className: "justify-center" },
};
