import { useState } from "react";
import { useFormDialog } from "@/components/ui";
import { can } from "@/domain/access";
import { DEAL_STAGE_LABELS, LOSS_REASON_LABELS } from "@/domain/constants";
import { isOpenDeal } from "@/domain/rules";
import type { Deal, LossReason } from "@/domain/types";
import { useNameLookup } from "@/lib/hooks";
import { parseMoneyInput } from "@/lib/money";
import { zodValidate } from "@/lib/validation";
import {
  useActiveCycle,
  useChangeDealStage,
  useClients,
  useCreateDeal,
  useCycleDeals,
  useFunnel,
  useMembers,
} from "@/queries";
import { useCurrentUser } from "@/stores/auth";
import { toast, toastMutationError } from "@/stores/toast";
import { buildEmptyDealForm } from "./constants";
import { dealFormSchema } from "./schemas";
import type { FunnelPageState, LosingDeal } from "./types";

/**
 * Everything the funnel screen reads, decides and can do.
 *
 * Includes the two pieces of local state the screen owns: the "new deal" dialog
 * and the deal being closed as lost, which needs a reason before it can move.
 */
export function useFunnelPage(): FunnelPageState {
  const user = useCurrentUser();
  const { cycle } = useActiveCycle();

  const deals = useCycleDeals(cycle?.id);
  const clients = useClients();
  const members = useMembers();
  const summary = useFunnel({ cycleId: cycle?.id });
  const changeStage = useChangeDealStage();

  const [losing, setLosing] = useState<LosingDeal | null>(null);

  const dialog = useFormDialog({
    initial: buildEmptyDealForm,
    mutation: useCreateDeal(),
    validate: (form) => zodValidate(dealFormSchema, form),
    toInput: (form) => ({
      title: form.title.trim(),
      clientId: form.clientId,
      cycleId: cycle?.id ?? "",
      ownerId: form.ownerId,
      stage: form.stage,
      source: form.source,
      valueCents: parseMoneyInput(form.value) ?? 0,
      expectedCloseAt: form.expectedCloseAt,
      closedAt: null,
      lossReason: null,
      notes: form.notes.trim(),
    }),
    successMessage: () => "Negócio cadastrado no funil.",
  });

  return {
    editable: can(user, "deal:manage"),
    deals,
    open: (deals.data ?? []).filter(isOpenDeal),
    summary,
    clients: clients.data ?? [],
    members: members.data ?? [],
    clientName: useNameLookup(clients.data),
    memberName: useNameLookup(members.data),
    dialog,
    /** The pickers default to the first record, resolved at click time. */
    openDialog: () =>
      dialog.openWith({
        clientId: clients.data?.[0]?.id ?? "",
        ownerId: user?.memberId ?? members.data?.[0]?.id ?? "",
      }),
    moving: changeStage.isPending,
    advance: (deal: Deal, stage: Deal["stage"]) =>
      changeStage.mutate(
        { id: deal.id, stage },
        {
          onSuccess: () =>
            toast.success(
              `${deal.title}: movido para ${DEAL_STAGE_LABELS[stage]}.`,
            ),
          onError: (cause) => toastMutationError(cause),
        },
      ),
    losing,
    startLosing: (deal: Deal) => setLosing({ id: deal.id, reason: "price" }),
    changeLossReason: (reason: LossReason) =>
      setLosing((current) => (current ? { ...current, reason } : current)),
    cancelLosing: () => setLosing(null),
    confirmLoss: () => {
      if (!losing) return;
      const lost = deals.data?.find((deal) => deal.id === losing.id);
      changeStage.mutate(
        { id: losing.id, stage: "lost", lossReason: losing.reason },
        {
          onSuccess: () =>
            toast.info(
              `${lost?.title ?? "Negócio"} marcado como perdido — ${LOSS_REASON_LABELS[losing.reason]}.`,
            ),
          onError: (cause) => toastMutationError(cause),
        },
      );
      setLosing(null);
    },
  };
}
