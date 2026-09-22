import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeToggle } from "./ThemeToggle";

const meta = {
  title: "UI/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Claro, escuro, ou o que o sistema disser. São três estados e não um interruptor: " +
          '"Sistema" é o padrão honesto — continua seguindo o sistema operacional depois que a ' +
          "aba fecha — e um interruptor de duas posições desligaria isso em silêncio na primeira " +
          "vez que alguém encostasse nele. A escolha fica no rodapé da barra lateral e também na " +
          "tela de login, para quem chega no escuro antes de entrar.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[240px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

/** Na largura da barra lateral, que é onde ele mora. */
export const NaBarraLateral: Story = {
  render: () => (
    <div className="w-[228px] rounded-xl border border-linha bg-papel-alto p-3">
      <ThemeToggle />
    </div>
  ),
};
