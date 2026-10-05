import {
  labelOptions,
  nameOptions,
  SelectField,
  TextField,
} from "@/components/ui";
import {
  FINANCE_CATEGORY_LABELS,
  FINANCE_KIND_LABELS,
} from "@/domain/constants";
import { setField } from "@/lib/utils";
import type { FinanceFormProps } from "./types";

const KIND_OPTIONS = labelOptions(FINANCE_KIND_LABELS);
const CATEGORY_OPTIONS = labelOptions(FINANCE_CATEGORY_LABELS);
const NONE_OPTION = { value: "", label: "Sem vínculo" };

/**
 * A line of the cash flow.
 *
 * The contract fields sit at the bottom and default to "sem vínculo" on
 * purpose: most of what an EJ spends has nothing to do with a project — the
 * salgados for a coffee break, the federation fee, the prize from a competition
 * — and a form that opens asking which project the salgados belong to teaches
 * people that those things do not go in the system.
 */
const FinanceForm: React.FC<FinanceFormProps> = ({
  value,
  projects,
  clients,
  members,
  workAreas,
  onChange,
}) => {
  const set = setField(value, onChange);
  const isIncome = value.kind === "receivable";

  return (
    <>
      <TextField
        label="Descrição"
        value={value.description}
        placeholder="Salgados do coffee break da reunião geral"
        onChange={(event) => set("description", event.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Tipo"
          value={value.kind}
          onValueChange={(next) => set("kind", next)}
          options={KIND_OPTIONS}
        />
        <SelectField
          label="Categoria"
          value={value.category}
          onValueChange={(next) => set("category", next)}
          options={CATEGORY_OPTIONS}
        />
        <TextField
          label="Valor (R$)"
          inputMode="decimal"
          value={value.amount}
          placeholder="200"
          onChange={(event) => set("amount", event.target.value)}
        />
        <SelectField
          label="Situação"
          value={value.settled ? "settled" : "open"}
          onValueChange={(next) => set("settled", next === "settled")}
          options={[
            { value: "open", label: "Ainda vai acontecer" },
            { value: "settled", label: isIncome ? "Já recebido" : "Já pago" },
          ]}
        />
      </div>

      {/* A single date: for what already happened, the due day and the day
          the money moved are the same day. */}
      <TextField
        label={value.settled ? "Data" : "Vencimento"}
        hint={
          value.settled
            ? "O dia em que o dinheiro se moveu."
            : "Quando esta conta vence ou este valor deve entrar."
        }
        type="date"
        value={value.dueAt}
        onChange={(event) => set("dueAt", event.target.value)}
      />

      <SelectField
        label="Área responsável"
        hint="É o que permite fechar o orçamento por diretoria no fim da gestão."
        value={value.workAreaId}
        onValueChange={(next) => set("workAreaId", next)}
        options={nameOptions(workAreas)}
      />

      <SelectField
        label={isIncome ? "Recebido por" : "Pago por"}
        hint={
          isIncome
            ? "Opcional. O membro que recebeu em nome da EJ."
            : "Opcional. Quem pagou do próprio bolso — é o que permite reembolsar depois."
        }
        value={value.memberId}
        onValueChange={(next) => set("memberId", next)}
        options={[
          { value: "", label: "A EJ, direto na conta" },
          ...nameOptions(members),
        ]}
      />

      <TextField
        label="Nota fiscal ou comprovante"
        hint="Opcional. Número da NF, do recibo, ou o link de onde o arquivo está guardado."
        value={value.receiptRef}
        placeholder="NF 4471 — Panificadora Central"
        onChange={(event) => set("receiptRef", event.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Projeto"
          hint="Só para parcelas de contrato."
          value={value.projectId}
          onValueChange={(next) => set("projectId", next)}
          options={[NONE_OPTION, ...nameOptions(projects)]}
        />
        <SelectField
          label="Cliente"
          value={value.clientId}
          onValueChange={(next) => set("clientId", next)}
          options={[NONE_OPTION, ...nameOptions(clients)]}
        />
      </div>
    </>
  );
};

export { FinanceForm };
