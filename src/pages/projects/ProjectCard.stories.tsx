import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  burningMargin,
  deliveredProject,
  healthyMargin,
  inProgressProject,
  overdueProject,
  planningProject,
} from "@/stories/fixtures";
import { ProjectCard } from "./ProjectCard";

const meta = {
  title: "Páginas/Projetos/ProjectCard",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Card do quadro de projetos. Além de prazo e valor, mostra o consumo do " +
          "orçamento de horas e o preço por hora real — o número que corrige a " +
          "próxima proposta.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ul className="m-0 max-w-xs list-none p-0">
        <Story />
      </ul>
    ),
  ],
  args: {
    onMove: fn(),
    project: inProgressProject,
    clientName: "Padaria Pão de Ouro",
    ownerName: "Tobias Fernandes",
    margin: healthyMargin,
    editable: true,
    moving: false,
  },
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmExecucao: Story = {};

/** Prazo vencido: o selo passa a contar os dias de atraso. */
export const Atrasado: Story = {
  args: { project: overdueProject, clientName: "Vistoria Norte Engenharia" },
};

/** Orçamento estourado: a barra e a hora real viram âmbar. */
export const OrcamentoEstourado: Story = {
  args: {
    project: overdueProject,
    clientName: "Vistoria Norte Engenharia",
    margin: burningMargin,
  },
};

/** Em planejamento, e ainda sem horas lançadas para calcular margem. */
export const EmPlanejamento: Story = {
  args: {
    project: planningProject,
    clientName: "Clínica Bem Viver",
    ownerName: "Júlia Andrade",
    margin: undefined,
  },
};

/** Sem permissão de gerir projetos: o botão de avançar não aparece. */
export const Entregue: Story = {
  args: {
    project: deliveredProject,
    ownerName: "Júlia Andrade",
    margin: undefined,
    editable: false,
  },
};

/** Enquanto a mutação do TanStack Query está pendente. */
export const Movendo: Story = {
  args: { moving: true },
};
