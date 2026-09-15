import { useState } from 'react'
import { PageHeader } from '@/components/layout'
import {
  Button,
  EmptyState,
  Modal,
  Spinner,
  StatusSelect,
  Table,
  TableCell,
  TableRow,
} from '@/components/ui'
import {
  MEMBER_ROLE_LABELS,
  MEMBER_STATUS_LABELS,
  MEMBER_STATUS_TONES,
} from '@/domain/constants'
import type { MemberStatus } from '@/domain/types'
import { formatDate, formatHours, getInitials } from '@/lib/format'
import {
  useCreateMember,
  useHoursByMember,
  useMembers,
  useUpdateMemberStatus,
} from '@/queries'
import { buildEmptyMemberForm, MEMBERS_TABLE_HEADERS } from './constants'
import { MemberForm } from './MemberForm'
import type { MemberFormState } from './types'

const STATUS_OPTIONS = (Object.keys(MEMBER_STATUS_LABELS) as MemberStatus[]).map(
  (status) => ({ value: status, label: MEMBER_STATUS_LABELS[status] }),
)

export function MembersPage() {
  const members = useMembers()
  const hoursByMember = useHoursByMember()

  const createMember = useCreateMember()
  const updateStatus = useUpdateMemberStatus()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<MemberFormState>(buildEmptyMemberForm)
  const [error, setError] = useState<string | null>(null)

  const hoursOf = (memberId: string) =>
    hoursByMember.data?.find((row) => row.memberId === memberId)?.hours ?? 0

  function openDialog() {
    setForm(buildEmptyMemberForm())
    setError(null)
    setOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Informe o nome e o e-mail do membro.')
      return
    }

    setError(null)

    try {
      await createMember.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        course: form.course.trim(),
        status: form.status,
        joinedAt: form.joinedAt,
        weeklyHours: Number(form.weeklyHours) || 0,
      })
      setOpen(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.')
    }
  }

  return (
    <>
      <PageHeader
        title="Membros"
        description="Equipe, cargos e carga horária pactuada. O cadastro acompanha a EJ nas gestões seguintes."
        action={<Button onClick={openDialog}>Novo membro</Button>}
      />

      {members.isPending && <Spinner label="Carregando equipe…" />}
      {members.isError && (
        <p className="text-sm text-ambar">{members.error.message}</p>
      )}

      {members.data?.length === 0 && (
        <EmptyState
          title="Nenhum membro cadastrado"
          description="Registre a equipe para começar a acompanhar horas e responsabilidades."
          action={<Button onClick={openDialog}>Novo membro</Button>}
        />
      )}

      {members.data && members.data.length > 0 && (
        <Table headers={MEMBERS_TABLE_HEADERS}>
          {members.data.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-violeta-lav text-[0.72rem] font-semibold text-violeta"
                  >
                    {getInitials(member.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="m-0 font-semibold">{member.name}</p>
                    <p className="m-0 text-[0.78rem] text-tinta-suave">
                      {member.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-tinta-suave">
                {MEMBER_ROLE_LABELS[member.role]}
              </TableCell>
              <TableCell className="text-tinta-suave">{member.course}</TableCell>
              <TableCell className="whitespace-nowrap">
                {formatHours(member.weeklyHours)}/sem
              </TableCell>
              <TableCell className="whitespace-nowrap font-display font-bold">
                {formatHours(hoursOf(member.id))}
              </TableCell>
              <TableCell>
                <StatusSelect
                  value={member.status}
                  tone={MEMBER_STATUS_TONES[member.status]}
                  accessibleLabel={`Situação de ${member.name}`}
                  options={STATUS_OPTIONS}
                  disabled={updateStatus.isPending}
                  onChange={(status) => updateStatus.mutate({ id: member.id, status })}
                />
              </TableCell>
              <TableCell className="whitespace-nowrap text-tinta-suave">
                {formatDate(member.joinedAt)}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      <Modal open={open} title="Novo membro" onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-4">
          <MemberForm value={form} onChange={setForm} />

          {error && <p className="m-0 text-[0.85rem] text-ambar">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="subtle" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={createMember.isPending}>
              {createMember.isPending ? 'Salvando…' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
