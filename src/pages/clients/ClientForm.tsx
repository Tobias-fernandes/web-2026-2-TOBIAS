import {
  labelOptions,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui";
import { CLIENT_STATUS_LABELS } from "@/domain/constants";
import type { ClientStatus } from "@/domain/types";
import { formatCnpj, formatPhone } from "@/lib/document";
import { setField } from "@/lib/utils";
import type { ClientFormProps } from "./types";

const STATUS_OPTIONS = labelOptions(CLIENT_STATUS_LABELS);

const ClientForm: React.FC<ClientFormProps> = ({ value, onChange }) => {
  const set = setField(value, onChange);

  return (
    <>
      <TextField
        label="Nome ou razão social"
        value={value.name}
        onChange={(event) => set("name", event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="CNPJ"
          inputMode="numeric"
          hint="Opcional para leads."
          value={formatCnpj(value.taxId)}
          onChange={(event) => set("taxId", event.target.value)}
        />
        <TextField
          label="Segmento"
          value={value.segment}
          onChange={(event) => set("segment", event.target.value)}
        />
        <TextField
          label="Pessoa de contato"
          value={value.contactName}
          onChange={(event) => set("contactName", event.target.value)}
        />
        <TextField
          label="Telefone"
          inputMode="tel"
          value={formatPhone(value.phone)}
          onChange={(event) => set("phone", event.target.value)}
        />
        <TextField
          label="E-mail"
          type="email"
          value={value.email}
          onChange={(event) => set("email", event.target.value)}
        />
        <SelectField
          label="Situação"
          value={value.status}
          onChange={(event) =>
            set("status", event.target.value as ClientStatus)
          }
          options={STATUS_OPTIONS}
        />
      </div>
      <TextAreaField
        label="Observações"
        value={value.notes}
        onChange={(event) => set("notes", event.target.value)}
        placeholder="Como chegou até a EJ, histórico de conversas…"
      />
    </>
  );
};

export { ClientForm };
