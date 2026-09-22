import { useQuery } from "@tanstack/react-query";
import { dataLayer } from "@/services";
import { createEntityQueries } from "./createEntityQueries";
import { queryKeys } from "./queryKeys";

/**
 * How the enterprise is organised: itself, the courses it admits from, and the
 * areas it runs. All three are read constantly — the sidebar names the EJ, and
 * every member form resolves a course and an area — and change almost never.
 */
export function useEnterprise() {
  return useQuery({
    queryKey: queryKeys.enterprise.all,
    queryFn: () => dataLayer.enterprise.current(),
  });
}

const courses = createEntityQueries(queryKeys.courses, dataLayer.courses);

export const useCourses = courses.useList;
export const useCreateCourse = courses.useCreate;
export const useUpdateCourse = courses.useUpdate;
export const useRemoveCourse = courses.useRemove;

const workAreas = createEntityQueries(queryKeys.workAreas, dataLayer.workAreas);

export const useWorkAreas = workAreas.useList;
export const useCreateWorkArea = workAreas.useCreate;
export const useUpdateWorkArea = workAreas.useUpdate;
export const useRemoveWorkArea = workAreas.useRemove;
