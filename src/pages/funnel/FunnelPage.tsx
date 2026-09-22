import { PageHeader } from "@/components/layout";
import {
  Button,
  EmptyState,
  FormDialog,
  ListState,
  SkeletonBoard,
} from "@/components/ui";
import { DealBoard } from "./DealBoard";
import { DealForm } from "./DealForm";
import { FunnelSummaryRow } from "./FunnelSummaryRow";
import { LossReasonDialog } from "./LossReasonDialog";
import { SourceTable } from "./SourceTable";
import { useFunnelPage } from "./hooks";

const FunnelPage: React.FC = () => {
  const funnel = useFunnelPage();

  return (
    <>
      <PageHeader
        title="Funil comercial"
        description="Cada negociação com etapa, valor, origem e responsável — inclusive as perdidas, que são o que explica a taxa de conversão."
        action={
          funnel.editable && (
            <Button onClick={funnel.openDialog}>Nova oportunidade</Button>
          )
        }
      />

      <FunnelSummaryRow
        summary={funnel.summary}
        openCount={funnel.open.length}
      />

      <ListState
        query={funnel.deals}
        rows={funnel.open}
        loadingLabel="Carregando o funil…"
        skeleton={<SkeletonBoard />}
        empty={
          <EmptyState
            title="Nenhuma negociação aberta"
            description="Registre a primeira oportunidade da gestão para acompanhar a prospecção fora do WhatsApp."
            action={
              funnel.editable && (
                <Button onClick={funnel.openDialog}>Nova oportunidade</Button>
              )
            }
          />
        }
      >
        {(rows) => (
          <DealBoard
            deals={rows}
            clientName={funnel.clientName}
            memberName={funnel.memberName}
            editable={funnel.editable}
            moving={funnel.moving}
            onAdvance={funnel.advance}
            onLose={funnel.startLosing}
          />
        )}
      </ListState>

      <SourceTable summary={funnel.summary} />

      <FormDialog
        open={funnel.dialog.open}
        title="Nova oportunidade"
        submitLabel="Registrar"
        error={funnel.dialog.error}
        submitting={funnel.dialog.submitting}
        onSubmit={funnel.dialog.submit}
        onClose={funnel.dialog.close}
      >
        <DealForm
          value={funnel.dialog.form}
          clients={funnel.clients}
          members={funnel.members}
          onChange={funnel.dialog.setForm}
        />
      </FormDialog>

      <LossReasonDialog
        reason={funnel.losing?.reason ?? null}
        submitting={funnel.moving}
        onChange={funnel.changeLossReason}
        onCancel={funnel.cancelLosing}
        onConfirm={funnel.confirmLoss}
      />
    </>
  );
};

export { FunnelPage };
