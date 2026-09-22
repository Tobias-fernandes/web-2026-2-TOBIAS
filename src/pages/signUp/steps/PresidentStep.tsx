import { AvatarField, SelectField, TextField } from "@/components/ui";
import { formatAcademicTerm, formatCpf, formatPhone } from "@/lib/document";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import type { PresidentDraft } from "../types";
import type { StepProps } from "./types";

const PresidentStep: React.FC<StepProps> = ({ value, onChange }) => {
  const president = value.president;

  const set = <K extends keyof PresidentDraft>(
    key: K,
    next: PresidentDraft[K],
  ) => onChange({ ...value, president: { ...president, [key]: next } });

  const courseOptions = [
    { value: "", label: "Selecione…" },
    ...value.courses.map((course) => ({ value: course, label: course })),
  ];

  const areaOptions = [
    { value: "", label: "Selecione…" },
    ...value.workAreas
      .filter((area) => area.name.trim())
      .map((area) => ({ value: area.name, label: area.name })),
  ];

  return (
    <>
      <TextField
        label="Nome completo"
        value={president.name}
        onChange={(event) => set("name", event.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="E-mail"
          type="email"
          autoComplete="username"
          hint="É com ele que você vai entrar no sistema."
          value={president.email}
          onChange={(event) => set("email", event.target.value)}
        />
        <TextField
          label="Telefone"
          inputMode="tel"
          value={formatPhone(president.phone)}
          onChange={(event) => set("phone", event.target.value)}
        />
        <TextField
          label="CPF"
          inputMode="numeric"
          value={formatCpf(president.cpf)}
          onChange={(event) => set("cpf", event.target.value)}
        />
        <TextField
          label="Matrícula"
          value={president.registration}
          onChange={(event) => set("registration", event.target.value)}
        />
        <SelectField
          label="Curso"
          value={president.course}
          onChange={(event) => set("course", event.target.value)}
          options={courseOptions}
        />
        <TextField
          label="Ingresso na faculdade"
          placeholder="2023.1"
          inputMode="numeric"
          value={president.entryTerm}
          onChange={(event) =>
            set("entryTerm", formatAcademicTerm(event.target.value))
          }
        />
        <SelectField
          label="Área de atuação"
          value={president.workArea}
          onChange={(event) => set("workArea", event.target.value)}
          options={areaOptions}
        />
      </div>

      <AvatarField
        label="Foto de perfil"
        name={president.name}
        value={president.avatarUrl}
        onChange={(avatarUrl) => set("avatarUrl", avatarUrl)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Senha"
          type="password"
          autoComplete="new-password"
          hint={`Ao menos ${MIN_PASSWORD_LENGTH} caracteres.`}
          value={president.password}
          onChange={(event) => set("password", event.target.value)}
        />
        <TextField
          label="Repita a senha"
          type="password"
          autoComplete="new-password"
          value={president.passwordConfirmation}
          onChange={(event) => set("passwordConfirmation", event.target.value)}
        />
      </div>
    </>
  );
};

export { PresidentStep };
