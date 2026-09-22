import { useMemo } from "react";
import { useFormDialog } from "@/components/ui";
import { can } from "@/domain/access";
import { PROJECT_STATUS_LABELS } from "@/domain/constants";
import { todayIso } from "@/lib/date";
import { useNameLookup } from "@/lib/hooks";
import { parseMoneyInput } from "@/lib/money";
import { zodValidate } from "@/lib/validation";
import {
  useActiveCycle,
  useChangeProjectStatus,
  useClients,
  useCreateProject,
  useCycleProjects,
  useMembers,
  useProjectMargins,
} from "@/queries";
import { useCurrentUser } from "@/stores/auth";
import { toast, toastMutationError } from "@/stores/toast";
import { buildEmptyProjectForm } from "./constants";
import { projectFormSchema } from "./schemas";
import type { ProjectsPageState } from "./types";

export function useProjectsPage(): ProjectsPageState {
  const user = useCurrentUser();
  const { cycle } = useActiveCycle();

  const projects = useCycleProjects(cycle?.id);
  const clients = useClients();
  const members = useMembers();
  const margins = useProjectMargins(cycle?.id);
  const changeStatus = useChangeProjectStatus();

  const marginByProject = useMemo(
    () =>
      new Map((margins.data ?? []).map((margin) => [margin.projectId, margin])),
    [margins.data],
  );

  const dialog = useFormDialog({
    initial: buildEmptyProjectForm,
    mutation: useCreateProject(),
    validate: (form) => zodValidate(projectFormSchema, form),
    toInput: (form) => ({
      name: form.name.trim(),
      clientId: form.clientId,
      cycleId: cycle?.id ?? "",
      ownerId: form.ownerId,
      teamIds: form.ownerId ? [form.ownerId] : [],
      scope: form.scope.trim(),
      status: form.status,
      stage: form.stage.trim() || PROJECT_STATUS_LABELS[form.status],
      contractValueCents: parseMoneyInput(form.contractValue) ?? 0,
      estimatedHours: Number(form.estimatedHours) || 0,
      startedAt: form.startedAt || todayIso(),
      dueAt: form.dueAt || form.startedAt || todayIso(),
      closedAt: null,
      npsScore: null,
      dealId: null,
    }),
    successMessage: () => "Projeto cadastrado.",
  });

  return {
    editable: can(user, "project:manage"),
    projects,
    clients: clients.data ?? [],
    members: members.data ?? [],
    clientName: useNameLookup(clients.data),
    memberName: useNameLookup(members.data),
    marginOf: (projectId) => marginByProject.get(projectId),
    moving: changeStatus.isPending,
    move: (project, status) =>
      changeStatus.mutate(
        { id: project.id, status },
        {
          onSuccess: () =>
            toast.success(
              `${project.name}: status alterado para ${PROJECT_STATUS_LABELS[status]}.`,
            ),
          onError: (cause) => toastMutationError(cause),
        },
      ),
    dialog,
    /** The pickers default to the first record, resolved at click time. */
    openDialog: () =>
      dialog.openWith({
        clientId: clients.data?.[0]?.id ?? "",
        ownerId: user?.memberId ?? members.data?.[0]?.id ?? "",
      }),
  };
}
