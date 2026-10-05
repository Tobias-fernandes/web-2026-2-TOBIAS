import { z } from "zod";
import type { Cycle } from "@/domain/types";
import { todayIso } from "@/lib/date";

/**
 * Needs the siblings a management is being checked against, so it is built fresh
 * per submit rather than declared once — a plain schema has no way to see
 * "every other cycle this EJ already has".
 */
export const buildCycleFormSchema = (others: Cycle[]) =>
  z
    .object({
      startsAt: z.string().min(1, "Informe o dia em que a diretoria assumiu."),
      status: z.enum(["planned", "active", "closed"]),
    })
    .superRefine((form, ctx) => {
      // Closing stamps today's date, and a management that has not started yet
      // would end before it began.
      if (form.status === "closed" && form.startsAt > todayIso()) {
        ctx.addIssue(
          "Uma gestão que ainda não começou não pode ser encerrada.",
        );
        return;
      }

      // A management is yearly and named after the year it starts (`describeCycle`),
      // so two in the same year would be two managements with the same name — and
      // a second one "in progress" would leave `useActiveCycle` choosing between
      // them by no criterion that makes sense to whoever is reading the dashboard.
      const year = form.startsAt.slice(0, 4);
      if (others.some((item) => item.startsAt.slice(0, 4) === year)) {
        ctx.addIssue(`Já existe uma gestão de ${year}.`);
        return;
      }
      if (
        form.status === "active" &&
        others.some((item) => item.status === "active")
      ) {
        ctx.addIssue(
          "Já existe uma gestão em andamento. Encerre-a antes de abrir outra.",
        );
      }
    });
