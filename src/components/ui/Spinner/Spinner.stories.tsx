import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Indicador de carregamento com `role="status"`, para que leitores de tela ' +
          "anunciem a espera. É o que as páginas mostram enquanto `isPending` do TanStack Query é verdadeiro.",
      },
    },
  },
  argTypes: { label: { control: "text" } },
  args: {},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComRotulo: Story = {
  args: { label: "Carregando projetos…" },
};
