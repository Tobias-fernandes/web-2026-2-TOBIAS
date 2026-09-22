import type {
  Allocation,
  CalendarEvent,
  Client,
  Course,
  Cycle,
  Deal,
  FinanceEntry,
  Member,
  Membership,
  Project,
  TimeEntry,
  WorkArea,
} from "@/domain/types";
import { isWithinPeriod, overlapsPeriod, todayIso } from "@/lib/date";
import type {
  AllocationFilter,
  AllocationRepository,
  CalendarEventFilter,
  CalendarEventRepository,
  DealFilter,
  DealRepository,
  FinanceFilter,
  FinanceRepository,
  MemberAdmission,
  MemberRepository,
  MembershipFilter,
  MembershipRepository,
  ProjectFilter,
  ProjectRepository,
  TimeEntryFilter,
  TimeEntryRepository,
} from "@/services/types";
import {
  SEED_COURSES,
  SEED_WORK_AREAS,
  SEED_ALLOCATIONS,
  SEED_CALENDAR_EVENTS,
  SEED_CLIENTS,
  SEED_CYCLES,
  SEED_DEALS,
  SEED_FINANCE_ENTRIES,
  SEED_MEMBERS,
  SEED_MEMBERSHIPS,
  SEED_PROJECTS,
  SEED_TIME_ENTRIES,
} from "./seed";
import { createMockRepository } from "./createMockRepository";

/** Stamped on insert by the API in production; here by the demo repository. */
const datedNow = () => ({ createdAt: todayIso() });

export const courses = createMockRepository<Course>({
  key: "courses",
  seed: SEED_COURSES,
  idPrefix: "crs",
  stamp: datedNow,
});

export const workAreas = createMockRepository<WorkArea>({
  key: "work-areas",
  seed: SEED_WORK_AREAS,
  idPrefix: "wka",
  stamp: datedNow,
});

export const cycles = createMockRepository<Cycle>({
  key: "cycles",
  seed: SEED_CYCLES,
  idPrefix: "cyc",
  stamp: datedNow,
});

const baseMembers = createMockRepository<Member>({
  key: "members",
  seed: SEED_MEMBERS,
  idPrefix: "mem",
  stamp: datedNow,
});

export const clients = createMockRepository<Client>({
  key: "clients",
  seed: SEED_CLIENTS,
  idPrefix: "cli",
  stamp: datedNow,
});

const baseMemberships = createMockRepository<Membership>({
  key: "memberships",
  seed: SEED_MEMBERSHIPS,
  idPrefix: "msh",
  stamp: datedNow,
});

export const memberships: MembershipRepository = {
  ...baseMemberships,
  async listBy({ cycleId, memberId }: MembershipFilter) {
    const all = await baseMemberships.list();
    return all.filter(
      (item) =>
        (!cycleId || item.cycleId === cycleId) &&
        (!memberId || item.memberId === memberId),
    );
  },
};

export const members: MemberRepository = {
  ...baseMembers,
  async admit({ member, membership }: MemberAdmission) {
    const created = await baseMembers.create(member);
    await memberships.create({ ...membership, memberId: created.id });
    return created;
  },
};

const baseDeals = createMockRepository<Deal>({
  key: "deals",
  seed: SEED_DEALS,
  idPrefix: "dea",
  stamp: datedNow,
});

export const deals: DealRepository = {
  ...baseDeals,
  async listBy({ cycleId, stage }: DealFilter) {
    const all = await baseDeals.list();
    return all.filter(
      (item) =>
        (!cycleId || item.cycleId === cycleId) &&
        (!stage || item.stage === stage),
    );
  },

  async changeStage(id, stage, lossReason) {
    const isClosing = stage === "won" || stage === "lost";
    return baseDeals.update(id, {
      stage,
      closedAt: isClosing ? todayIso() : null,
      // The reason only belongs to a loss; winning clears whatever was there.
      lossReason: stage === "lost" ? (lossReason ?? "other") : null,
    });
  },
};

const baseProjects = createMockRepository<Project>({
  key: "projects",
  seed: SEED_PROJECTS,
  idPrefix: "prj",
  stamp: datedNow,
});

export const projects: ProjectRepository = {
  ...baseProjects,
  async listBy({ cycleId, status }: ProjectFilter) {
    const all = await baseProjects.list();
    return all.filter(
      (item) =>
        (!cycleId || item.cycleId === cycleId) &&
        (!status || item.status === status),
    );
  },

  async changeStatus(id, status) {
    const isClosing = status === "delivered" || status === "cancelled";
    return baseProjects.update(id, {
      status,
      closedAt: isClosing ? todayIso() : null,
    });
  },
};

const baseAllocations = createMockRepository<Allocation>({
  key: "allocations",
  seed: SEED_ALLOCATIONS,
  idPrefix: "alo",
  stamp: datedNow,
});

export const allocations: AllocationRepository = {
  ...baseAllocations,
  async listBy({ memberId, projectId, activeOn }: AllocationFilter) {
    const all = await baseAllocations.list();
    return all.filter(
      (item) =>
        (!memberId || item.memberId === memberId) &&
        (!projectId || item.projectId === projectId) &&
        (!activeOn || (item.startsAt <= activeOn && item.endsAt >= activeOn)),
    );
  },
};

const baseTimeEntries = createMockRepository<TimeEntry>({
  key: "timeEntries",
  seed: SEED_TIME_ENTRIES,
  idPrefix: "tim",
});

export const timeEntries: TimeEntryRepository = {
  ...baseTimeEntries,
  async listBy({ memberId, projectId, from, to }: TimeEntryFilter) {
    const all = await baseTimeEntries.list();
    return all.filter(
      (item) =>
        (!memberId || item.memberId === memberId) &&
        (!projectId || item.projectId === projectId) &&
        isWithinPeriod(item.date, from, to),
    );
  },
};

const baseFinance = createMockRepository<FinanceEntry>({
  key: "finance",
  seed: SEED_FINANCE_ENTRIES,
  idPrefix: "fin",
  stamp: datedNow,
});

export const finance: FinanceRepository = {
  ...baseFinance,
  async listBy({ cycleId, kind, settlement }: FinanceFilter) {
    const all = await baseFinance.list();
    const today = todayIso();

    return all.filter((item) => {
      if (cycleId && item.cycleId !== cycleId) return false;
      if (kind && item.kind !== kind) return false;
      if (settlement === "settled") return item.paidAt !== null;
      if (settlement === "open") return item.paidAt === null;
      if (settlement === "overdue")
        return item.paidAt === null && item.dueAt < today;
      return true;
    });
  },

  async settle(id, paidAt) {
    return baseFinance.update(id, { paidAt });
  },
};

const baseCalendarEvents = createMockRepository<CalendarEvent>({
  key: "calendarEvents",
  seed: SEED_CALENDAR_EVENTS,
  idPrefix: "evt",
  stamp: datedNow,
});

export const calendarEvents: CalendarEventRepository = {
  ...baseCalendarEvents,
  async listBy({ cycleId, directorate, kind, from, to }: CalendarEventFilter) {
    const all = await baseCalendarEvents.list();
    return all.filter(
      (item) =>
        (!cycleId || item.cycleId === cycleId) &&
        (!directorate || item.directorate === directorate) &&
        (!kind || item.kind === kind) &&
        // Overlap, not containment: a commitment that spans the turn of the
        // month belongs to both months' calendars.
        overlapsPeriod(item.startsAt, item.endsAt, from, to),
    );
  },

  async cancel(id, cancelled) {
    return baseCalendarEvents.update(id, {
      status: cancelled ? "cancelled" : "scheduled",
    });
  },
};
