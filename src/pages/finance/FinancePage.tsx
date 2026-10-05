import { PageHeader } from "@/components/layout";
import {
  Button,
  Card,
  FormDialog,
  SelectField,
  type SelectOption,
} from "@/components/ui";
import { FINANCE_KIND_LABELS } from "@/domain/constants";
import { CashFlowRow } from "./CashFlowRow";
import { FinanceForm } from "./FinanceForm";
import { LedgerTable } from "./LedgerTable";
import { useFinancePage } from "./hooks";
import type { FinanceFilterState } from "./types";

const KIND_FILTER_OPTIONS: SelectOption<FinanceFilterState["kind"]>[] = [
  { value: "", label: "Entradas e saídas" },
  { value: "receivable", label: FINANCE_KIND_LABELS.receivable },
  { value: "payable", label: FINANCE_KIND_LABELS.payable },
];

const SETTLEMENT_FILTER_OPTIONS: SelectOption<
  FinanceFilterState["settlement"]
>[] = [
  { value: "", label: "Todas" },
  { value: "open", label: "Em aberto" },
  { value: "overdue", label: "Vencidas" },
  { value: "settled", label: "Quitadas" },
];

const FinancePage: React.FC = () => {
  const ledger = useFinancePage();

  return (
    <>
      <PageHeader
        title="Contas e fluxo de caixa"
        description="Tudo que entra e sai, com data — parcela de contrato, mensalidade, premiação, coffee break. Contrato assinado não é dinheiro em conta, e a diferença entre os dois aparece aqui."
        action={
          ledger.editable && (
            <Button onClick={() => ledger.dialog.openWith()}>
              Novo lançamento
            </Button>
          )
        }
      />

      <CashFlowRow cashFlow={ledger.cashFlow} />

      <Card className="mb-5 p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <SelectField
            label="Tipo"
            value={ledger.filter.kind}
            options={KIND_FILTER_OPTIONS}
            onValueChange={(next) =>
              ledger.setFilter({
                ...ledger.filter,
                kind: next,
              })
            }
          />
          <SelectField
            label="Situação"
            value={ledger.filter.settlement}
            options={SETTLEMENT_FILTER_OPTIONS}
            onValueChange={(next) =>
              ledger.setFilter({
                ...ledger.filter,
                settlement: next,
              })
            }
          />
          <Button variant="subtle" onClick={() => ledger.clearFilter()}>
            Limpar filtros
          </Button>
        </div>
      </Card>

      <LedgerTable {...ledger} />

      <FormDialog
        open={ledger.dialog.open}
        title="Novo lançamento"
        submitLabel="Registrar"
        error={ledger.dialog.error}
        submitting={ledger.dialog.submitting}
        onSubmit={ledger.dialog.submit}
        onClose={ledger.dialog.close}
      >
        <FinanceForm
          value={ledger.dialog.form}
          projects={ledger.projects}
          clients={ledger.clients}
          workAreas={ledger.workAreas}
          members={ledger.members}
          onChange={ledger.dialog.setForm}
        />
      </FormDialog>
    </>
  );
};

export { FinancePage };
