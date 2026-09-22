import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SkeletonBars,
  SkeletonBoard,
  SkeletonList,
  SkeletonMetrics,
  SkeletonRows,
  SkeletonTable,
} from "./composites";

const meta = {
  title: "UI/Skeleton",
  component: SkeletonTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Placeholders com a forma do que está por vir. Preferidos ao spinner porque dizem " +
          "*o quê* está carregando: o leitor vê o contorno da tabela ou dos quatro cartões " +
          "antes dos números chegarem, então a página não pula quando eles chegam e não há " +
          "nada para reler. Um spinner comunica apenas que algo acontece. Os blocos são " +
          '`aria-hidden` e cada composição carrega um `role="status"` só, para o leitor de ' +
          "tela ouvir uma frase em vez de uma dúzia de caixas vazias.",
      },
    },
  },
} satisfies Meta<typeof SkeletonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tabela: Story = {
  args: { rows: 4, columns: 5 },
};

export const Indicadores: Story = {
  render: () => <SkeletonMetrics />,
};

/** Metas da gestão, carga da equipe, horas por categoria. */
export const Barras: Story = {
  render: () => (
    <div className="max-w-md">
      <SkeletonBars />
    </div>
  ),
};

/** Quadro de projetos e funil comercial. */
export const Quadro: Story = {
  render: () => <SkeletonBoard />,
};

export const Lista: Story = {
  render: () => (
    <div className="max-w-md">
      <SkeletonList />
    </div>
  ),
};

/** Rótulo à esquerda, número à direita: o caixa da gestão. */
export const Linhas: Story = {
  render: () => (
    <div className="max-w-sm">
      <SkeletonRows />
    </div>
  ),
};
