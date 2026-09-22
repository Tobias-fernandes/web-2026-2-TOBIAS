import type { HoursByCategory } from "@/domain/types";

const useCategoryBreakdown = ({ rows }: { rows: HoursByCategory[] }) => {
  const billable = rows.find((row) => row.category === "project");

  return { billable };
};

export { useCategoryBreakdown };
