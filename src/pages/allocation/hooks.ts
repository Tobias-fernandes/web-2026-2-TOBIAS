import { useFormDialog } from "@/components/ui";
import { can } from "@/domain/access";
import { OVERLOAD_THRESHOLD } from "@/domain/constants";
import { isActiveProject } from "@/domain/rules";
import { todayIso } from "@/lib/date";
import { useNameLookup } from "@/lib/hooks";
import { zodValidate } from "@/lib/validation";
import {
  useActiveCycle,
  useAllocations,
  useCreateAllocation,
  useCycleProjects,
  useMembers,
  useRemoveAllocation,
  useWorkloadByMember,
} from "@/queries";
import { useCurrentUser } from "@/stores/auth";
import { toast, toastMutationError } from "@/stores/toast";
import { buildEmptyAllocationForm, RUNS_THE_ENTERPRISE } from "./constants";
import { allocationFormSchema } from "./schemas";
import type { AllocationPageState } from "./types";

export function useAllocationPage(): AllocationPageState {
  const user = useCurrentUser();
  const { cycle } = useActiveCycle();

  const workload = useWorkloadByMember({ cycleId: cycle?.id });
  const allocations = useAllocations({ activeOn: todayIso() });
  const members = useMembers();
  const projects = useCycleProjects(cycle?.id);
  const removeAllocation = useRemoveAllocation();

  const openProjects = (projects.data ?? []).filter(isActiveProject);

  const dialog = useFormDialog({
    initial: buildEmptyAllocationForm,
    mutation: useCreateAllocation(),
    validate: (form) => zodValidate(allocationFormSchema, form),
    toInput: (form) => ({
      memberId: form.memberId,
      projectId: form.projectId,
      weeklyHours: Number(form.weeklyHours),
      startsAt: form.startsAt,
      endsAt: form.endsAt,
    }),
    successMessage: () => "Alocação cadastrada.",
  });

  const rows = workload.data ?? [];

  return {
    editable: can(user, "allocation:manage"),
    workload,
    allocations,
    members: members.data ?? [],
    openProjects,
    memberName: useNameLookup(members.data),
    projectName: useNameLookup(projects.data),
    overloaded: rows.filter((row) => row.overload > OVERLOAD_THRESHOLD),
    idle: rows.filter(
      (row) =>
        row.activeProjects === 0 &&
        row.status === "active" &&
        !RUNS_THE_ENTERPRISE.includes(row.role),
    ),
    removing: removeAllocation.isPending,
    removeAllocation: (id) =>
      removeAllocation.mutate(id, {
        onSuccess: () => toast.success("Alocação removida."),
        onError: (cause) => toastMutationError(cause),
      }),
    dialog,
    openDialog: () =>
      dialog.openWith({
        memberId: members.data?.[0]?.id ?? "",
        projectId: openProjects[0]?.id ?? "",
      }),
  };
}
