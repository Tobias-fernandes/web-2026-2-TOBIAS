import type { FormDialogState, Loadable } from "@/components/ui";
import type {
  CalendarEvent,
  Directorate,
  EventAudience,
  EventKind,
  ID,
  IsoDate,
  Project,
} from "@/domain/types";

export interface EventFormState {
  title: string;
  kind: EventKind;
  directorate: Directorate;
  audience: EventAudience;
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  startTime: string;
  endTime: string;
  location: string;
  onlineUrl: string;
  projectId: string;
  description: string;
}

export interface CalendarFilterState {
  directorate: "" | Directorate;
  kind: "" | EventKind;
}

/** One cell of the month grid. */
export interface CalendarDay {
  date: IsoDate;
  /** False for the days borrowed from the months on either side. */
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  /**
   * Everything happening that day, all-day commitments first — including the
   * project deliveries the page synthesises from `Project.dueAt`.
   */
  events: CalendarEvent[];
}

export interface CalendarPageState {
  /** Whether this member may schedule — directors, president and vice. */
  editable: boolean;

  month: IsoDate;
  monthLabel: string;
  isCurrentMonth: boolean;
  goToMonth: (offset: number) => void;
  goToToday: () => void;

  filter: CalendarFilterState;
  setFilter: (filter: CalendarFilterState) => void;
  clearFilter: () => void;
  filtering: boolean;

  events: Loadable<CalendarEvent[]>;
  days: CalendarDay[];
  /** Commitments opening in the month on screen, after the filters. */
  monthTotal: number;

  selectedDate: IsoDate;
  selectDate: (date: IsoDate) => void;
  selectedDay: CalendarDay | null;
  /** What is still to come inside the month on screen. */
  upcoming: CalendarEvent[];

  projects: Project[];
  projectName: (id: string) => string;
  memberName: (id: string) => string;

  dialog: FormDialogState<EventFormState>;
  /** Opens an empty form, already on the day the member clicked. */
  openDialog: (date?: IsoDate) => void;
  editEvent: (event: CalendarEvent) => void;
  toggleCancelled: (event: CalendarEvent) => void;
  removeEvent: (id: ID) => void;
  saving: boolean;
}

export interface EventCardProps {
  event: CalendarEvent;
  /** Whether this member may schedule at all. A derived event is never editable. */
  editable: boolean;
  saving: boolean;
  projectName: (id: string) => string;
  memberName: (id: string) => string;
  onEdit: (event: CalendarEvent) => void;
  onToggleCancelled: (event: CalendarEvent) => void;
  onRemove: (id: ID) => void;
}

export interface EventFormProps {
  value: EventFormState;
  projects: Project[];
  onChange: (value: EventFormState) => void;
}

export interface MonthGridProps {
  days: CalendarDay[];
  onSelect: (date: IsoDate) => void;
}
