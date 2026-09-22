import type { ID, IsoDate } from "./common";

export type ProjectStatus =
  "planning" | "inProgress" | "review" | "delivered" | "cancelled";

export interface Project {
  id: ID;
  name: string;
  clientId: ID;
  cycleId: ID;
  /** Project manager, accountable for the delivery and for approving hours. */
  ownerId: ID;
  teamIds: ID[];
  scope: string;
  status: ProjectStatus;
  /** Short label shown on the board card: "Sprint 3 de 5", "Revisão final"… */
  stage: string;
  contractValueCents: number;
  estimatedHours: number;
  startedAt: IsoDate;
  dueAt: IsoDate;
  closedAt: IsoDate | null;
  /** Client satisfaction, 0-10, collected at delivery. Null until then. */
  npsScore: number | null;
  /** Set when the deal that originated the project is known. */
  dealId: ID | null;
  createdAt: IsoDate;
}
