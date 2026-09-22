import { useMutation, useQuery } from "@tanstack/react-query";
import type { ID } from "@/domain/types";
import { dataLayer, type MemberAdmission } from "@/services";
import { createEntityQueries } from "./createEntityQueries";
import { queryKeys } from "./queryKeys";

const members = createEntityQueries(queryKeys.members, dataLayer.members);

export const useMembers = members.useList;
export const useMember = members.useDetail;
export const useCreateMember = members.useCreate;
export const useUpdateMember = members.useUpdate;

const memberships = createEntityQueries(
  queryKeys.memberships,
  dataLayer.memberships,
);

export const useCreateMembership = memberships.useCreate;
export const useUpdateMembership = memberships.useUpdate;
export const useRemoveMembership = memberships.useRemove;

/** Positions held in one management — the whole history is noise on a screen. */
export function useCycleMemberships(cycleId: ID | undefined) {
  return useQuery({
    queryKey: queryKeys.memberships.filtered({ cycleId }),
    queryFn: () => dataLayer.memberships.listBy({ cycleId }),
    enabled: Boolean(cycleId),
  });
}

/**
 * Admits someone: the person and the position they take, in one write.
 *
 * A real mutation rather than a pair of calls stitched together in a screen —
 * the rule that a member without a membership is invisible to every report
 * belongs to the data layer, not to the form that happens to trigger it.
 */
export function useAdmitMember() {
  return useMutation({
    mutationFn: (admission: MemberAdmission) =>
      dataLayer.members.admit(admission),
  });
}
