import {
  AvatarField,
  labelOptions,
  nameOptions,
  SelectField,
  TextField,
} from "@/components/ui";
import { MEMBER_ROLE_LABELS, MEMBER_STATUS_LABELS } from "@/domain/constants";
import type { MemberRole, MemberStatus } from "@/domain/types";
import { formatAcademicTerm, formatCpf, formatPhone } from "@/lib/document";
import { setField } from "@/lib/utils";
import type { MemberFormProps } from "./types";

const ROLE_OPTIONS = labelOptions(MEMBER_ROLE_LABELS);
const STATUS_OPTIONS = labelOptions(MEMBER_STATUS_LABELS);

const MemberForm: React.FC<MemberFormProps> = ({
  value,
  cycleName,
  courses,
  workAreas,
  onChange,
}) => {
  const set = setField(value, onChange);

  return (
    <>
      <TextField
        label="Nome completo"
        value={value.name}
        onChange={(event) => set("name", event.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="E-mail"
          type="email"
          hint="É para este endereço que o convite vai."
          value={value.email}
          onChange={(event) => set("email", event.target.value)}
        />
        <TextField
          label="Telefone"
          inputMode="tel"
          value={formatPhone(value.phone)}
          onChange={(event) => set("phone", event.target.value)}
        />
        <TextField
          label="CPF"
          inputMode="numeric"
          value={formatCpf(value.cpf)}
          onChange={(event) => set("cpf", event.target.value)}
        />
        <TextField
          label="Matrícula"
          value={value.registration}
          onChange={(event) => set("registration", event.target.value)}
        />
        <SelectField
          label="Curso"
          value={value.courseId}
          onChange={(event) => set("courseId", event.target.value)}
          options={nameOptions(courses)}
        />
        <TextField
          label="Ingresso na faculdade"
          placeholder="2023.1"
          inputMode="numeric"
          value={value.entryTerm}
          onChange={(event) =>
            set("entryTerm", formatAcademicTerm(event.target.value))
          }
        />
        <TextField
          label="Entrou na EJ em"
          type="date"
          value={value.joinedAt}
          onChange={(event) => set("joinedAt", event.target.value)}
        />
        <SelectField
          label="Situação"
          value={value.status}
          onChange={(event) =>
            set("status", event.target.value as MemberStatus)
          }
          options={STATUS_OPTIONS}
        />
      </div>

      <AvatarField
        label="Foto de perfil"
        name={value.name}
        value={value.avatarUrl}
        onChange={(avatarUrl) => set("avatarUrl", avatarUrl)}
      />

      <fieldset className="m-0 mt-2 border-0 p-0">
        <legend className="mb-1 text-sm font-semibold text-tinta">
          Posição na gestão {cycleName}
        </legend>
        <p className="mt-0 mb-3 text-xs text-tinta-suave">
          Cargo e carga valem só para esta gestão. Na virada da diretoria, a
          pessoa continua; a posição é registrada de novo.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            label="Cargo"
            value={value.role}
            onChange={(event) => set("role", event.target.value as MemberRole)}
            options={ROLE_OPTIONS}
          />
          <SelectField
            label="Área"
            value={value.workAreaId}
            onChange={(event) => set("workAreaId", event.target.value)}
            options={nameOptions(workAreas)}
          />
          <TextField
            label="Carga semanal (h)"
            type="number"
            min={0}
            value={value.weeklyHours}
            onChange={(event) => set("weeklyHours", event.target.value)}
          />
        </div>
      </fieldset>
    </>
  );
};

export { MemberForm };
