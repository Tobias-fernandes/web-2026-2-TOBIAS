import type { FormDialogState, Loadable } from "@/components/ui";
import type {
  Client,
  Deal,
  DealSource,
  DealStage,
  FunnelSummary,
  LossReason,
  Member,
} from "@/domain/types";

export interface DealFormState {
  title: string;
  clientId: string;
  ownerId: string;
  stage: DealStage;
  source: DealSource;
  /** Typed in reais and converted to cents on submit. */
  value: string;
  expectedCloseAt: string;
  notes: string;
}

/** A deal on its way to being closed as lost, with the reason chosen so far. */
export interface LosingDeal {
  id: string;
  reason: LossReason;
}

export interface FunnelPageState {
  editable: boolean;
  deals: Loadable<Deal[]>;
  /** The deals still moving through the board. */
  open: Deal[];
  summary: Loadable<FunnelSummary>;
  clients: Client[];
  members: Member[];
  clientName: (id: string) => string;
  memberName: (id: string) => string;
  dialog: FormDialogState<DealFormState>;
  openDialog: () => void;
  moving: boolean;
  advance: (deal: Deal, stage: DealStage) => void;
  losing: LosingDeal | null;
  startLosing: (deal: Deal) => void;
  changeLossReason: (reason: LossReason) => void;
  cancelLosing: () => void;
  confirmLoss: () => void;
}

export interface DealBoardProps {
  deals: Deal[];
  clientName: (id: string) => string;
  memberName: (id: string) => string;
  editable: boolean;
  moving: boolean;
  onAdvance: (deal: Deal, stage: DealStage) => void;
  onLose: (deal: Deal) => void;
}

export interface DealCardProps {
  deal: Deal;
  clientName: string;
  ownerName: string;
  editable: boolean;
  moving: boolean;
  onAdvance: (stage: DealStage) => void;
  onLose: () => void;
}

export interface DealFormProps {
  value: DealFormState;
  clients: Client[];
  members: Member[];
  onChange: (value: DealFormState) => void;
}

export interface LossReasonDialogProps {
  reason: LossReason | null;
  submitting: boolean;
  onChange: (reason: LossReason) => void;
  onCancel: () => void;
  onConfirm: () => void;
}
