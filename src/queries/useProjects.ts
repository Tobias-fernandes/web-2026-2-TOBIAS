import { useMutation, useQuery } from "@tanstack/react-query";
import type { ID, ProjectStatus } from "@/domain/types";
import { dataLayer } from "@/services";
import { createEntityQueries } from "./createEntityQueries";
import { queryKeys } from "./queryKeys";

const projects = createEntityQueries(queryKeys.projects, dataLayer.projects);

/** Every project, for name lookups and pickers that span managements. */
export const useProjects = projects.useList;
export const useProject = projects.useDetail;
export const useCreateProject = projects.useCreate;
export const useUpdateProject = projects.useUpdate;

/**
 * The projects of one management.
 *
 * Takes the id rather than a filter object so that "the cycle has not loaded
 * yet" stays distinguishable from "no filter". Disabled until it arrives, which
 * keeps the screen on its skeleton instead of announcing an empty board.
 */
export function useCycleProjects(cycleId: ID | undefined) {
  return useQuery({
    queryKey: queryKeys.projects.filtered({ cycleId }),
    queryFn: () => dataLayer.projects.listBy({ cycleId }),
    enabled: Boolean(cycleId),
  });
}

/** Board moves go through the repository's own endpoint, not a generic update. */
export function useChangeProjectStatus() {
  return useMutation({
    mutationFn: ({ id, status }: { id: ID; status: ProjectStatus }) =>
      dataLayer.projects.changeStatus(id, status),
  });
}
