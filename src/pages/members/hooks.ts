import { useMemo } from 'react'
import { useFormDialog } from '@/components/ui'
import { can } from '@/domain/access'
import { describeCycle, MEMBER_STATUS_LABELS } from '@/domain/constants'
import { toast, toastMutationError } from '@/stores/toast'
import {
  useActiveCycle,
  useAdmitMember,
  useCourses,
  useCycleMemberships,
  useMembers,
  useUpdateMember,
  useWorkAreas,
  useWorkloadByMember,
} from '@/queries'
import { onlyDigits } from '@/lib/document'
import { zodValidate } from '@/lib/validation'
import type { MemberAdmission } from '@/services'
import { useCurrentUser } from '@/stores/auth'
import { buildEmptyMemberForm } from './constants'
import { memberFormSchema } from './schemas'
import type { MembersPageState } from './types'

export function useMembersPage(): MembersPageState {
  const user = useCurrentUser()
  const { cycle } = useActiveCycle()

  const members = useMembers()
  const courses = useCourses()
  const workAreas = useWorkAreas()
  const memberships = useCycleMemberships(cycle?.id)
  const workload = useWorkloadByMember({ cycleId: cycle?.id })
  const updateMember = useUpdateMember()

  const dialog = useFormDialog({
    initial: buildEmptyMemberForm,
    mutation: useAdmitMember(),
    // The membership is not optional: a member admitted outside a management
    // would exist without a position, and no report would ever see them.
    validate: (form) => {
      if (!cycle) return 'Abra a gestão do ano antes de admitir alguém.'
      return zodValidate(memberFormSchema, form)
    },
    toInput: (form): MemberAdmission => ({
      member: {
        enterpriseId: user?.enterpriseId ?? '',
        name: form.name.trim(),
        email: form.email.trim(),
        phone: onlyDigits(form.phone),
        cpf: onlyDigits(form.cpf),
        registration: form.registration.trim(),
        entryTerm: form.entryTerm.trim(),
        courseId: form.courseId,
        avatarUrl: form.avatarUrl,
        status: form.status,
        joinedAt: form.joinedAt,
        leftAt: null,
      },
      membership: {
        cycleId: cycle?.id ?? '',
        role: form.role,
        workAreaId: form.workAreaId,
        weeklyHours: Number(form.weeklyHours) || 0,
        // Whoever joined mid-year owes hours from the day they arrived.
        startsAt:
          cycle && form.joinedAt > cycle.startsAt
            ? form.joinedAt
            : (cycle?.startsAt ?? form.joinedAt),
        endsAt: null,
      },
    }),
    successMessage: () => 'Convite enviado — a pessoa confirma o cadastro para aparecer como ativa.',
  })

  const membershipOf = useMemo(() => {
    const byMember = new Map(
      (memberships.data ?? []).map((item) => [item.memberId, item]),
    )
    return (memberId: string) => byMember.get(memberId)
  }, [memberships.data])

  const courseName = useMemo(() => {
    const byId = new Map((courses.data ?? []).map((item) => [item.id, item.name]))
    return (courseId: string) => byId.get(courseId) ?? '—'
  }, [courses.data])

  const workAreaName = useMemo(() => {
    const byId = new Map((workAreas.data ?? []).map((item) => [item.id, item.name]))
    return (workAreaId: string) => byId.get(workAreaId) ?? '—'
  }, [workAreas.data])

  const hoursOf = useMemo(() => {
    const byMember = new Map(
      (workload.data ?? []).map((row) => [row.memberId, row.loggedHours]),
    )
    return (memberId: string) => byMember.get(memberId) ?? 0
  }, [workload.data])

  return {
    editable: can(user, 'member:manage'),
    description: cycle
      ? `Quem é a EJ e qual posição cada pessoa ocupa na gestão ${describeCycle(cycle)}. O cadastro atravessa as gestões; o cargo, não.`
      : 'Cadastro da equipe da empresa júnior.',
    roster: {
      data: members.data,
      isPending: members.isPending || memberships.isPending,
      error: members.error ?? memberships.error,
    },
    rows: useMemo(
      () =>
        [...(members.data ?? [])].sort((a, b) => {
          const inCycle =
            Number(Boolean(membershipOf(b.id))) - Number(Boolean(membershipOf(a.id)))
          return inCycle !== 0 ? inCycle : a.name.localeCompare(b.name)
        }),
      [members.data, membershipOf],
    ),
    membershipOf,
    hoursOf,
    courses: courses.data ?? [],
    workAreas: workAreas.data ?? [],
    courseName,
    workAreaName,
    updating: updateMember.isPending,
    changeStatus: (member, status) =>
      updateMember.mutate(
        { id: member.id, input: { status } },
        {
          onSuccess: () =>
            toast.success(`${member.name}: situação alterada para ${MEMBER_STATUS_LABELS[status]}.`),
          onError: (cause) => toastMutationError(cause),
        },
      ),
    dialog,
    cycleName: cycle ? describeCycle(cycle) : '—',
  }
}
