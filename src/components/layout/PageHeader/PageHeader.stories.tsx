import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "./PageHeader";

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: {
    title: "Projetos",
    description:
      "Cada contrato com escopo, responsável, prazo e situação visíveis para a diretoria inteira.",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComAcao: Story = {
  args: { action: <Button>Novo projeto</Button> },
};

/** No description — used when the title is enough. */
export const SoTitulo: Story = {
  args: { title: "Olá, Tobias", description: undefined },
};
