import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["solid", "outline", "subtle", "danger"],
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Novo projeto",
    variant: "solid",
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solido: Story = {};

export const Contorno: Story = {
  args: { variant: "outline", children: "Imprimir / salvar PDF" },
};

/** Ação secundária dentro de cartões e modais. */
export const Sutil: Story = {
  args: { variant: "subtle", children: "Cancelar" },
};

/** Ação destrutiva — usada para exclusões. */
export const Perigo: Story = {
  args: { variant: "danger", children: "Excluir lançamento" },
};

export const Desabilitado: Story = {
  args: { disabled: true, children: "Salvando…" },
};

/** Todas as variantes juntas, para comparar peso visual. */
export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="solid">
        Sólido
      </Button>
      <Button {...args} variant="outline">
        Contorno
      </Button>
      <Button {...args} variant="subtle">
        Sutil
      </Button>
      <Button {...args} variant="danger">
        Perigo
      </Button>
    </div>
  ),
};
