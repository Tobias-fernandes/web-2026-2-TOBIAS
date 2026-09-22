import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "@/stories/decorators";
import { NoCycle } from "./NoCycle";

const meta = {
  title: "Layout/NoCycle",
  component: NoCycle,
  tags: ["autodocs"],
  decorators: [withRouter],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "O que `RequireCycle` mostra no lugar das oito telas com recorte de " +
          "gestão, antes de a EJ abrir a primeira. Toda leitura por ciclo fica " +
          "desabilitada enquanto não há ciclo para recortar, então sem isto a " +
          "tela ficaria para sempre num esqueleto esperando uma requisição que " +
          "nunca sai — o estado de uma instalação recém-criada.",
      },
    },
  },
} satisfies Meta<typeof NoCycle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
