import { useMemo, useState } from "react";
import { useFormDialog } from "@/components/ui";
import { can } from "@/domain/access";
import { isActiveProject, isScheduledEvent } from "@/domain/rules";
import type { CalendarEvent, ID, IsoDate, Project } from "@/domain/types";
import {
  addMonths,
  endOfMonth,
  isSameMonth,
  monthGrid,
  overlapsPeriod,
  startOfMonth,
  todayIso,
} from "@/lib/date";
import { formatMonthYear } from "@/lib/format";
import { useNameLookup } from "@/lib/hooks";
import { zodValidate } from "@/lib/validation";
import {
  useActiveCycle,
  useCancelCalendarEvent,
  useCycleCalendarEvents,
  useCycleProjects,
  useMembers,
  useRemoveCalendarEvent,
  useUpsertCalendarEvent,
} from "@/queries";
import { useCurrentUser } from "@/stores/auth";
import { toast, toastMutationError } from "@/stores/toast";
import {
  buildEmptyEventForm,
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
  DERIVED_ID_PREFIX,
  EMPTY_CALENDAR_FILTER,
  UPCOMING_LIMIT,
} from "./constants";
import { eventFormSchema } from "./schemas";
import type {
  CalendarDay,
  CalendarFilterState,
  CalendarPageState,
  EventFormState,
} from "./types";

/**
 * Reading order inside a day: what is already running, then the clock.
 *
 * An all-day commitment has no hour to sort by, and leaving it among the timed
 * ones puts "Semana do processo seletivo" between the 18:30 and the 19:00.
 */
function byStart(a: CalendarEvent, b: CalendarEvent): number {
  if (a.startsAt !== b.startsAt) return a.startsAt.localeCompare(b.startsAt);
  if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
  return (a.startTime ?? "").localeCompare(b.startTime ?? "");
}

/** True on every day the commitment spans, not only the day it opens. */
const coversDate = (event: CalendarEvent, date: IsoDate) =>
  overlapsPeriod(event.startsAt, event.endsAt, date, date);

/**
 * A project's delivery, written as a commitment.
 *
 * Synthesised rather than stored: the due date belongs to the project, and a
 * copy here would be the one that stops agreeing with the board the first time
 * a prazo moves. Shaped as a `CalendarEvent` so it travels the same filter, the
 * same sort and the same cell as everything else — a second list beside the
 * events meant the filters had to be reimplemented for it, and the month grid
 * had to split its three chips between two arrays.
 */
function deadlineEvent(project: Project, cycleId: ID): CalendarEvent {
  return {
    id: DERIVED_ID_PREFIX + project.id,
    cycleId,
    title: `Entrega · ${project.name}`,
    kind: "deadline",
    directorate: "projects",
    audience: "enterprise",
    startsAt: project.dueAt,
    endsAt: project.dueAt,
    allDay: true,
    startTime: null,
    endTime: null,
    location: "",
    onlineUrl: null,
    description: "Prazo de entrega, vindo do quadro de projetos.",
    projectId: project.id,
    status: "scheduled",
    createdBy: project.ownerId,
    createdAt: project.createdAt,
  };
}

/** The record turned back into the form that edits it. */
function toForm(event: CalendarEvent): EventFormState {
  return {
    title: event.title,
    kind: event.kind,
    directorate: event.directorate,
    audience: event.audience,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    allDay: event.allDay,
    // An all-day commitment carries no hour, so the pickers open on the usual
    // evening rather than on an empty field the member has to fill twice.
    startTime: event.startTime ?? DEFAULT_START_TIME,
    endTime: event.endTime ?? DEFAULT_END_TIME,
    location: event.location,
    onlineUrl: event.onlineUrl ?? "",
    projectId: event.projectId ?? "",
    description: event.description,
  };
}

/**
 * The calendar's month: which one is on screen, what happens in it, and what
 * this member is allowed to change.
 */
export function useCalendarPage(): CalendarPageState {
  const user = useCurrentUser();
  const { cycle } = useActiveCycle();
  const today = todayIso();

  const [month, setMonth] = useState<IsoDate>(() => startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<IsoDate>(today);
  const [filter, setFilter] = useState<CalendarFilterState>(
    EMPTY_CALENDAR_FILTER,
  );

  const grid = useMemo(() => monthGrid(month), [month]);

  const events = useCycleCalendarEvents(
    cycle?.id,
    grid[0],
    grid[grid.length - 1],
  );
  const projects = useCycleProjects(cycle?.id);
  const members = useMembers();

  const cancel = useCancelCalendarEvent();
  const remove = useRemoveCalendarEvent();

  const loaded = useMemo(() => events.data ?? [], [events.data]);

  /**
   * A delivery already scheduled as a real commitment — with a pauta, a room,
   * someone to ask — must not also be drawn as the bare derived one. The
   * scheduled one says more.
   */
  const deadlines = useMemo(() => {
    if (!cycle) return [];

    return (projects.data ?? [])
      .filter(isActiveProject)
      .filter(
        (project) =>
          !loaded.some(
            (event) =>
              event.projectId === project.id &&
              coversDate(event, project.dueAt),
          ),
      )
      .map((project) => deadlineEvent(project, cycle.id));
  }, [projects.data, loaded, cycle]);

  const visible = useMemo(
    () =>
      [...loaded, ...deadlines]
        .filter(
          (event) =>
            (!filter.directorate || event.directorate === filter.directorate) &&
            (!filter.kind || event.kind === filter.kind),
        )
        .sort(byStart),
    [loaded, deadlines, filter],
  );

  const days = useMemo<CalendarDay[]>(
    () =>
      grid.map((date) => ({
        date,
        inMonth: isSameMonth(date, month),
        isToday: date === today,
        isSelected: date === selectedDate,
        events: visible.filter((event) => coversDate(event, date)),
      })),
    [grid, month, today, selectedDate, visible],
  );

  const byId = useMemo(
    () => new Map(loaded.map((event) => [event.id, event])),
    [loaded],
  );

  const dialog = useFormDialog({
    initial: buildEmptyEventForm,
    mutation: useUpsertCalendarEvent(),
    validate: (form) => zodValidate(eventFormSchema, form),
    toInput: (form, editing) => {
      const current = editing ? byId.get(editing) : undefined;

      return {
        id: editing,
        input: {
          cycleId: cycle?.id ?? "",
          title: form.title.trim(),
          kind: form.kind,
          directorate: form.directorate,
          audience: form.audience,
          startsAt: form.startsAt,
          endsAt: form.endsAt,
          allDay: form.allDay,
          startTime: form.allDay ? null : form.startTime,
          endTime: form.allDay ? null : form.endTime,
          location: form.location.trim(),
          onlineUrl: form.onlineUrl.trim() || null,
          description: form.description.trim(),
          projectId: form.projectId || null,
          // Correcting the room of a cancelled meeting must not quietly put it
          // back on, and whoever scheduled it stays the person to ask.
          status: current?.status ?? "scheduled",
          createdBy: current?.createdBy ?? user?.memberId ?? "",
        },
      };
    },
    successMessage: (editing) =>
      editing ? "Compromisso atualizado." : "Compromisso agendado.",
  });

  return {
    editable: can(user, "event:manage"),

    month,
    monthLabel: formatMonthYear(month),
    isCurrentMonth: isSameMonth(month, today),
    /**
     * Stepping months carries the selection along, so the day panel beside the
     * grid always has a day to show — today when it is in view, the 1st when
     * it is not.
     */
    goToMonth: (offset) => {
      const next = startOfMonth(addMonths(month, offset));
      setMonth(next);
      setSelectedDate(isSameMonth(today, next) ? today : next);
    },
    goToToday: () => {
      setMonth(startOfMonth(today));
      setSelectedDate(today);
    },

    filter,
    setFilter,
    clearFilter: () => setFilter(EMPTY_CALENDAR_FILTER),
    filtering: filter.directorate !== "" || filter.kind !== "",

    events,
    days,
    monthTotal: visible.filter((event) =>
      overlapsPeriod(event.startsAt, event.endsAt, month, endOfMonth(month)),
    ).length,

    selectedDate,
    selectDate: setSelectedDate,
    selectedDay: days.find((day) => day.date === selectedDate) ?? null,
    upcoming: visible
      .filter((event) => event.endsAt >= today && isScheduledEvent(event))
      .slice(0, UPCOMING_LIMIT),

    projects: projects.data ?? [],
    projectName: useNameLookup(projects.data),
    memberName: useNameLookup(members.data),

    dialog,
    openDialog: (date = selectedDate) =>
      dialog.openWith({
        startsAt: date,
        endsAt: date,
        // The area the member leads is the one they schedule for most.
        directorate: user?.directorate ?? "presidency",
      }),
    editEvent: (event) => dialog.openFor(event.id, toForm(event)),
    toggleCancelled: (event) => {
      const cancelling = isScheduledEvent(event);
      cancel.mutate(
        { id: event.id, cancelled: cancelling },
        {
          onSuccess: () =>
            toast.success(
              cancelling
                ? `${event.title}: cancelado.`
                : `${event.title}: reagendado.`,
            ),
          onError: (cause) => toastMutationError(cause),
        },
      );
    },
    removeEvent: (id) => {
      const event = byId.get(id);
      remove.mutate(id, {
        onSuccess: () =>
          toast.success(`${event?.title ?? "Compromisso"} removido.`),
        onError: (cause) => toastMutationError(cause),
      });
    },
    saving: cancel.isPending || remove.isPending,
  };
}
