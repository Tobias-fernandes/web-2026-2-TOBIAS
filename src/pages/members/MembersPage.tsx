import { PageHeader } from '@/components/layout'
import {
  Badge,
  Button,
  EmptyState,
  FormDialog,
  ListState,
  SkeletonTable,
  StatusSelect,
  Table,
  TableCell,
  TableRow,
  labelOptions,
} from '@/components/ui'
import {
  MEMBER_ROLE_LABELS,
  MEMBER_STATUS_LABELS,
  MEMBER_STATUS_TONES,
} from '@/domain/constants'
import { formatDate, formatHours, getInitials } from '@/lib/format'
import { MEMBERS_TABLE_HEADERS } from './constants'
import { MemberForm } from './MemberForm'
import { useMembersPage } from './hooks'

const STATUS_OPTIONS = labelOptions(MEMBER_STATUS_LABELS)

export function MembersPage() {
  const roster = useMembersPage()


  return (
    <>
      <PageHeader
        title="Membros"
        description={roster.description}
        action={
          roster.editable && <Button onClick={() => roster.dialog.openWith()}>Novo membro</Button>
        }
      />

      <ListState
        query={roster.roster}
        rows={roster.rows}
        loadingLabel="Carregando equipe…"
        skeleton={<SkeletonTable columns={7} rows={6} />}
        empty={
          <EmptyState
            title="Nenhum membro cadastrado"
            description="Registre a equipe para começar a acompanhar horas, alocação e responsabilidades."
            action={
              roster.editable && <Button onClick={() => roster.dialog.openWith()}>Novo membro</Button>
            }
          />
        }
      >
        {(list) => (
          <Table headers={MEMBERS_TABLE_HEADERS}>
            {list.map((member) => {
              const membership = roster.membershipOf(member.id)

              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="grid size-8 shrink-0 place-items-center rounded-full bg-violeta-lav text-2xs font-semibold text-violeta"
                      >
                        {getInitials(member.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="m-0 font-semibold">{member.name}</p>
                        <p className="m-0 text-xs text-tinta-suave">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {membership ? (
                      <Badge tone="violet">
                        {MEMBER_ROLE_LABELS[membership.role]}
                      </Badge>
                    ) : (
                      <span className="text-sm text-tinta-suave">
                        Fora desta gestão
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-tinta-suave">
                    {membership ? roster.workAreaName(membership.workAreaId) : '—'}
                  </TableCell>

                  <TableCell className="text-tinta-suave">
                    {roster.courseName(member.courseId)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {membership ? `${formatHours(membership.weeklyHours)}/sem` : '—'}
                  </TableCell>

                  <TableCell className="whitespace-nowrap font-display font-bold">
                    {formatHours(roster.hoursOf(member.id))}
                  </TableCell>

                  <TableCell>
                    <StatusSelect
                      value={member.status}
                      tone={MEMBER_STATUS_TONES[member.status]}
                      accessibleLabel={`Situação de ${member.name}`}
                      options={STATUS_OPTIONS}
                      disabled={!roster.editable || roster.updating}
                      onChange={(status) => roster.changeStatus(member, status)}
                    />
                    <span className="mt-0.5 block text-2xs text-tinta-suave">
                      desde {formatDate(member.joinedAt)}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </Table>
        )}
      </ListState>

      <FormDialog
        open={roster.dialog.open}
        title="Novo membro"
        submitLabel="Cadastrar"
        error={roster.dialog.error}
        submitting={roster.dialog.submitting}
        onSubmit={roster.dialog.submit}
        onClose={roster.dialog.close}
      >
        <MemberForm
          value={roster.dialog.form}
          cycleName={roster.cycleName}
          courses={roster.courses}
          workAreas={roster.workAreas}
          onChange={roster.dialog.setForm}
        />
      </FormDialog>
    </>
  )
}
