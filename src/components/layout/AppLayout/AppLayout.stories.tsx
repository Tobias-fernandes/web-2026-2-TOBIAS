import type { Meta, StoryObj } from "@storybook/react-vite";
import { traineeUser } from "@/stories/fixtures";
import { withAuthenticatedUser, withOutletRouter } from "@/stories/decorators";
import { AppLayout } from "./AppLayout";

const meta = {
  title: "Layout/AppLayout",
  component: AppLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Moldura do sistema: navegação lateral, identificação do usuário e o `<Outlet>` das rotas. " +
          "O usuário vem do store Zustand, populado pelo decorator `withAuthenticatedUser`.",
      },
    },
  },
  decorators: [withOutletRouter("/app"), withAuthenticatedUser()],
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

/** Outro cargo no topo — o rótulo e as iniciais acompanham o usuário. */
export const ComoTrainee: Story = {
  decorators: [withAuthenticatedUser(traineeUser)],
};

/** Em telas estreitas a navegação colapsa atrás do botão "Menu". */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
