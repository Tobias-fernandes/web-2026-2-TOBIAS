import type { TimeEntryCategory } from "@/domain/types";
import { todayIso } from "@/lib/date";
import type { TimeEntryFormState } from "./types";

/** Built per open, so the date is today's rather than the date of the first load. */
export const buildEmptyTimeEntryForm = (): TimeEntryFormState => ({
  memberId: "",
  category: "project",
  projectId: "",
  date: todayIso(),
  hours: "",
  description: "",
});

/** Smallest increment accepted when logging hours. */
export const HOURS_STEP = 0.5;

export const WEEK_ENTRIES_HEADERS = [
  "Dia",
  "Atividade",
  "O que foi feito",
  "Horas",
  "",
];

/** Shown where an entry was saved without a description. */
export const NO_DESCRIPTION = "—";

/**
 * What the category field says under it, when the choice needs telling apart.
 * Training and independent study are the pair members confuse: the line is
 * whether someone organised it, not what was learned.
 */
export const TIME_ENTRY_CATEGORY_HINTS: Partial<
  Record<TimeEntryCategory, string>
> = {
  training:
    "Algo organizado, com hora marcada: workshop da EJ, curso ministrado, treinamento da federação.",
  studying:
    "Estudo por conta própria de algo que a EJ usa. Se alguém organizou, é Capacitação.",
};

export const DEFAULT_TIME_ENTRY_CATEGORY_HINT =
  "Não é só projeto: reunião de diretoria, capacitação e prospecção também contam.";
