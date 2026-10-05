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

/** Over budget: the bar and the realised hourly rate turn amber. */
export const OrcamentoEstourado: Story = {
  args: {
    project: overdueProject,
    clientName: "Vistoria Norte Engenharia",
    margin: burningMargin,
  },
};

/** In planning, with no hours logged yet to compute a margin. */
export const EmPlanejamento: Story = {
  args: {
    project: planningProject,
    clientName: "Clínica Bem Viver",
    ownerName: "Júlia Andrade",
    margin: undefined,
  },
};

/** Without permission to manage projects: the advance button is hidden. */
export const Entregue: Story = {
  args: {
    project: deliveredProject,
    ownerName: "Júlia Andrade",
    margin: undefined,
    editable: false,
  },
};

/** While the TanStack Query mutation is pending. */
export const Movendo: Story = {
  args: { moving: true },
};
