import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { todayIso } from "@/lib/date";
import { projectList } from "@/stories/fixtures";
import { TimeEntryForm } from "./TimeEntryForm";
import type { TimeEntryFormState } from "./types";

const meta = {
  title: "Páginas/Horas/TimeEntryForm",
  component: TimeEntryForm,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex max-w-lg flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
    value: {
      memberId: "mem-1",
      category: "project",
      projectId: projectList[0].id,
      date: todayIso(),
      hours: "",
      description: "",
    },
    projects: projectList,
  },
} satisfies Meta<typeof TimeEntryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vazio: Story = {};

export const Preenchido: Story = {
  args: {
    value: {
      memberId: "mem-4",
      category: "project",
      projectId: projectList[1].id,
      date: "2026-09-10",
      hours: "4.5",
      description: "Ajustes de layout no catálogo",
    },
  },
};

/** Hora que não é de projeto: o seletor de projeto some do formulário. */
export const HoraDeGestaoInterna: Story = {
  args: {
    value: {
      memberId: "mem-1",
      category: "internal",
      projectId: "",
      date: todayIso(),
      hours: "2",
      description: "Reunião de diretoria executiva",
    },
  },
};

export const Interativo: Story = {
  render: (args) => {
    const [value, setValue] = useState<TimeEntryFormState>(args.value);
    return <TimeEntryForm {...args} value={value} onChange={setValue} />;
  },
};
