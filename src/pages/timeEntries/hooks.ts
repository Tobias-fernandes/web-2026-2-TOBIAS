import { useMemo, useState } from 'react'
import { useFormDialog } from '@/components/ui'
import { can } from '@/domain/access'
import { TIME_ENTRY_CATEGORY_LABELS } from '@/domain/constants'
import type { IsoDate, Member, TimeEntry } from '@/domain/types'
import { addDays, startOfWeek, todayIso, weekDates } from '@/lib/date'
import { useNameLookup } from '@/lib/hooks'
import { zodValidate } from '@/lib/validation'
import {
  useActiveCycle,
  useCreateTimeEntry,
  useCycleMemberships,
  useDeleteTimeEntry,
  useMembers,
  useProjects,
  useTimeEntries,
} from '@/queries'
import { useCurrentUser } from '@/stores/auth'
import { toast, toastMutationError } from '@/stores/toast'
import { buildEmptyTimeEntryForm } from './constants'
import { timeEntryFormSchema } from './schemas'
import type { TimeEntryFormState, TimesheetPageState, TimesheetRow } from './types'

/** Collapses the week's entries into one line per project or category. */
function buildRows(
  entries: TimeEntry[],
  projectName: (id: string) => string,
): TimesheetRow[] {
  const rows = new Map<string, TimesheetRow>()

  for (const entry of entries) {
    const key = entry.projectId ?? entry.category
    const row = rows.get(key) ?? {
      key,
      label: entry.projectId
        ? projectName(entry.projectId)
        : TIME_ENTRY_CATEGORY_LABELS[entry.category],
      detail: TIME_ENTRY_CATEGORY_LABELS[entry.category],
      category: entry.category,
      projectId: entry.projectId ?? '',
      hoursByDate: {},
      total: 0,
    }

    row.hoursByDate[entry.date] = (row.hoursByDate[entry.date] ?? 0) + entry.hours
    row.total += entry.hours
    rows.set(key, row)
  }

  return [...rows.values()].sort((a, b) => b.total - a.total)
}

/**
 * Whose week is on screen, and whether this account has one at all.
 *
 * The signed-in identity is not necessarily a member of this EJ: an account
 * created before anyone registered the person — the state a fresh system is in
 * — carries a `memberId` that matches nothing. Left alone, the picker showed
 * the first member while the hours were written against the id that does not
 * exist, and those hours counted in every report without appearing on anyone's
 * timesheet.
 *
 * Both answers come from here so they cannot disagree: the week being read and
 * the reason there is none are the same decision, and computing them apart
 * meant two expressions that had to be kept in step by hand.
 */
function resolveMember(
  chosenId: string,
  roster: Member[],
  seesEveryone: boolean,
): { memberId: string; unlinked: boolean } {
  if (roster.some((item) => item.id === chosenId)) {
    return { memberId: chosenId, unlinked: false }
  }

  // Whoever may read other people's weeks falls back to the first on the list,
  // which is what the picker was already displaying.
  if (seesEveryone) return { memberId: roster[0]?.id ?? chosenId, unlinked: false }

  // Whoever may not keeps the unresolvable id: the week comes back empty, and
  // the screen says why instead of letting them log against a ghost.
  return { memberId: chosenId, unlinked: roster.length > 0 }
}

/**
 * The timesheet's week: which one is on screen, whose it is, and what can be
 * done to it.
 */
export function useTimesheetPage(): TimesheetPageState {
  const user = useCurrentUser()
  const { cycle } = useActiveCycle()

  const [weekStart, setWeekStart] = useState<IsoDate>(() => startOfWeek())
  const [chosenId, setChosenId] = useState<string>(user?.memberId ?? '')

  const days = useMemo(() => weekDates(weekStart), [weekStart])
  const weekEnd = days[days.length - 1]
  const today = todayIso()

  const members = useMembers()
  const projects = useProjects()
  const memberships = useCycleMemberships(cycle?.id)
  const deleteEntry = useDeleteTimeEntry()

  const projectName = useNameLookup(projects.data)

  const seesEveryone = can(user, 'time:viewAll')
  const roster = members.data ?? []
  const { memberId, unlinked } = resolveMember(chosenId, roster, seesEveryone)

  const entries = useTimeEntries({
    memberId: memberId || undefined,
    from: weekStart,
    to: weekEnd,
  })

  const weekEntries = useMemo(
    () => [...(entries.data ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
    [entries.data],
  )

  const dialog = useFormDialog({
    initial: buildEmptyTimeEntryForm,
    mutation: useCreateTimeEntry(),
    validate: (form) => zodValidate(timeEntryFormSchema, form),
    toInput: (form) => ({
      memberId: form.memberId || memberId,
      projectId: form.category === 'project' ? form.projectId : null,
      category: form.category,
      date: form.date,
      hours: Number(form.hours),
      description: form.description.trim(),
    }),
    successMessage: () => 'Horas lançadas.',
  })

  return {
    seesEveryone,
    unlinked,
    members: roster,
    projects: projects.data ?? [],
    memberId,
    setMemberId: setChosenId,

    days,
    weekStart,
    weekEnd,
    today,
    isCurrentWeek: weekStart === startOfWeek(today),
    goToWeek: (offset) => setWeekStart(addDays(weekStart, offset * 7)),
    goToToday: () => setWeekStart(startOfWeek(today)),

    entries,
    weekEntries,
    rows: useMemo(() => buildRows(weekEntries, projectName), [weekEntries, projectName]),
    weekTotal: weekEntries.reduce((total, entry) => total + entry.hours, 0),
    committed:
      (memberships.data ?? []).find((item) => item.memberId === memberId)
        ?.weeklyHours ?? 0,
    projectName,
    memberName: useNameLookup(members.data),
    deleting: deleteEntry.isPending,
    removeEntry: (id) =>
      deleteEntry.mutate(id, {
        onSuccess: () => toast.success('Lançamento de horas removido.'),
        onError: (cause) => toastMutationError(cause),
      }),

    dialog,
    openDialog: (overrides: Partial<TimeEntryFormState> = {}) =>
      dialog.openWith({
        memberId,
        projectId: projects.data?.[0]?.id ?? '',
        date: today >= weekStart && today <= weekEnd ? today : weekStart,
        ...overrides,
      }),
  }
}
