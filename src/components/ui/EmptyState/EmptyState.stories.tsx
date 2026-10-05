import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "Nenhum projeto cadastrado",
    description:
      "Abra o primeiro contrato para começar a acompanhar prazos e horas.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComAcao: Story = {
  args: { action: <Button>Novo projeto</Button> },
};

/** No description — used when the title is already enough. */
export const SoTitulo: Story = {
  args: { description: undefined },
};

/** Empty search result: no action, because the way out is adjusting the filter. */
export const BuscaSemResultado: Story = {
  args: {
    title: "Nenhum cliente encontrado",
    description: "Tente outro termo de busca.",
  },
};
