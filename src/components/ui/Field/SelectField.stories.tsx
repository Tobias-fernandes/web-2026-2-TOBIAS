import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MEMBER_ROLE_LABELS, PROJECT_STATUS_LABELS } from "@/domain/constants";
import { memberList } from "@/stories/fixtures";
import { labelOptions } from "./options";
import { SelectField } from "./SelectField";

const meta = {
  title: "UI/Field/SelectField",
  component: SelectField,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Cargo",
    value: "",
    onValueChange: fn(),
    options: labelOptions(MEMBER_ROLE_LABELS),
  },
  // Controlled, so each story keeps its own choice while it is played with.
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <SelectField
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof SelectField<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing chosen yet: the placeholder shows, muted. */
export const Padrao: Story = {};

/** Project statuses, as in the new contract form. */
export const SituacaoDoProjeto: Story = {
  args: {
    label: "Situação",
    value: "inProgress",
    options: labelOptions(PROJECT_STATUS_LABELS),
  },
};

/** With the empty option first — the pattern filters use. */
export const ComoFiltro: Story = {
  args: {
    label: "Membro",
    options: [
      { value: "", label: "Todos" },
      ...memberList.map((member) => ({
        value: member.id,
        label: member.name,
      })),
    ],
  },
};

export const ComDica: Story = {
  args: { hint: "O cargo define o que a pessoa enxerga no sistema." },
};

export const ComErro: Story = {
  args: { error: "Escolha um cargo." },
};

export const Desabilitado: Story = {
  args: { value: "director", disabled: true },
};
