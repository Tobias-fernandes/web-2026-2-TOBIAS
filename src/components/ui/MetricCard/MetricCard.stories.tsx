import type { Meta, StoryObj } from "@storybook/react-vite";
import { formatHours, formatMoney } from "@/lib/format";
import { MetricCard } from "./MetricCard";

const meta = {
  title: "UI/MetricCard",
  component: MetricCard,
  tags: ["autodocs"],
  args: {
    label: "Projetos em execução",
    value: "2",
    hint: "2 em prospecção",
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const SemApoio: Story = {
  args: { hint: undefined },
};

/** A fileira completa, como aparece no topo do painel. */
export const FileiraDoPainel: Story = {
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Projetos em execução"
        value="2"
        hint="2 em prospecção"
      />
      <MetricCard
        label="Horas lançadas"
        value={formatHours(125)}
        hint="6 membros ativos"
      />
      <MetricCard
        label="Faturamento contratado"
        value={formatMoney(2_360_000)}
        hint={`${formatMoney(730_000)} já entregue`}
      />
      <MetricCard
        label="Clientes ativos"
        value="2"
        hint="2 projetos entregues"
      />
    </div>
  ),
};
