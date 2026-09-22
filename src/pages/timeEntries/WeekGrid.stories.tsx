import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { addDays, startOfWeek, todayIso, weekDates } from "@/lib/date";
import type { TimesheetRow } from "./types";
import { WeekGrid } from "./WeekGrid";

const monday = startOfWeek(todayIso());
const days = weekDates(monday);

const hours = (entries: [number, number][]): Record<string, number> =>
  Object.fromEntries(
    entries.map(([day, value]) => [addDays(monday, day), value]),
  );

const rows: TimesheetRow[] = [
  {
    key: "prj-2",
    label: "App de vistoria",
    detail: "Projeto",
    category: "project",
    projectId: "prj-2",
    hoursByDate: hours([
      [0, 4],
      [2, 3.5],
      [3, 2],
    ]),
    total: 9.5,
  },
  {
    key: "prj-1",
    label: "Site institucional",
    detail: "Projeto",
    category: "project",
    projectId: "prj-1",
    hoursByDate: hours([
      [1, 3],
      [4, 2.5],
    ]),
    total: 5.5,
  },
  {
    key: "internal",
    label: "Gestão interna",
    detail: "Gestão interna",
    category: "internal",
    projectId: "",
    hoursByDate: hours([[0, 2]]),
    total: 2,
  },
];

const meta = {
  title: "Páginas/Horas/WeekGrid",
  component: WeekGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A semana em uma grade, uma linha por projeto. É a tela de que todo o resto do " +
          "sistema depende: se lançar uma hora custar mais que alguns segundos, ninguém " +
          "lança e os relatórios viram ficção. Clicar na célula abre o diálogo já com o " +
          "projeto e o dia preenchidos.",
      },
    },
  },
  args: { days, rows, today: todayIso(), onCell: fn() },
} satisfies Meta<typeof WeekGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemanaPreenchida: Story = {};

/** Uma linha só e vários dias em branco — o buraco fica evidente. */
export const SemanaIncompleta: Story = {
  args: { rows: [rows[0]] },
};
