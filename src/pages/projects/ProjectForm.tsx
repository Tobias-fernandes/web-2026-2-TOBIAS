import {
  nameOptions,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui";
import {
  PROJECT_BOARD_COLUMNS,
  PROJECT_STATUS_LABELS,
} from "@/domain/constants";
import { setField } from "@/lib/utils";
import type { ProjectFormProps } from "./types";

/** Field set of the "new project" dialog, kept apart from the board itself. */
const ProjectForm: React.FC<ProjectFormProps> = ({
  value,
  clients,
  members,
  onChange,
}) => {
  const set = setField(value, onChange);

  return (
    <>
      <TextField
        label="Nome do projeto"
        value={value.name}
        onChange={(event) => set("name", event.target.value)}
        placeholder="Site institucional"
      />

      <SelectField
        label="Cliente"
        value={value.clientId}
        onValueChange={(next) => set("clientId", next)}
        options={nameOptions(clients)}
      />

      <SelectField
        label="Gerente do projeto"
        hint="Responsável pela entrega e pelo consumo do orçamento de horas."
        value={value.ownerId}
        onValueChange={(next) => set("ownerId", next)}
        options={nameOptions(members)}
      />

      <TextAreaField
        label="Escopo"
        value={value.scope}
        onChange={(event) => set("scope", event.target.value)}
        placeholder="O que está contratado e o que não está."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Situação"
          value={value.status}
          onValueChange={(next) => set("status", next)}
          options={PROJECT_BOARD_COLUMNS.map((status) => ({
            value: status,
            label: PROJECT_STATUS_LABELS[status],
          }))}
        />
        <TextField
          label="Etapa"
          value={value.stage}
          onChange={(event) => set("stage", event.target.value)}
          placeholder="Sprint 1 de 4"
        />
        <TextField
          label="Valor do contrato (R$)"
          inputMode="decimal"
          value={value.contractValue}
          placeholder="4800"
          onChange={(event) => set("contractValue", event.target.value)}
        />
        <TextField
          label="Horas orçadas"
          type="number"
          min={1}
          hint="A base do preço por hora — e da margem depois da entrega."
          value={value.estimatedHours}
          onChange={(event) => set("estimatedHours", event.target.value)}
        />
        <TextField
          label="Início"
          type="date"
          value={value.startedAt}
          onChange={(event) => set("startedAt", event.target.value)}
        />
        <TextField
          label="Prazo"
          type="date"
          value={value.dueAt}
          onChange={(event) => set("dueAt", event.target.value)}
        />
      </div>
    </>
  );
};

export { ProjectForm };
