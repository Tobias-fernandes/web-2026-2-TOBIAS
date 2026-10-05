import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  CLIENT_STATUS_LABELS,
  DIRECTORATE_LABELS,
  EVENT_KIND_LABELS,
} from "@/domain/constants";
import { labelOptions } from "../Field/options";
import { STATUS_SELECT_TONE_CLASSES } from "../StatusSelect/constants";
import { Select } from "./Select";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
  args: {
    value: "",
    onValueChange: fn(),
    options: labelOptions(DIRECTORATE_LABELS),
    "aria-label": "Diretoria",
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <Select
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof Select<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try the keyboard: arrows, Home/End, typing "fin" jumps to Financeiro. */
export const Padrao: Story = {};

export const ComValor: Story = {
  args: { value: "finance" },
};

/** A list longer than the box scrolls inside it, with the highlight kept in view. */
export const ListaLonga: Story = {
  args: {
    value: "selection",
    options: [
      ...labelOptions(EVENT_KIND_LABELS),
      ...Array.from({ length: 12 }, (_, index) => ({
        value: `extra-${index}`,
        label: `Opção extra ${index + 1}`,
      })),
    ],
  },
};

/** Inside a table row, coloured by the state it holds — what `StatusSelect` renders. */
export const Compacto: Story = {
  args: {
    value: "negotiating",
    size: "compact",
    options: labelOptions(CLIENT_STATUS_LABELS),
    className: STATUS_SELECT_TONE_CLASSES.amber,
  },
};

export const Invalido: Story = {
  args: { invalid: true },
};

export const Desabilitado: Story = {
  args: { value: "projects", disabled: true },
};
