import type { ClientFormState } from "./types";

export const EMPTY_CLIENT_FORM: ClientFormState = {
  name: "",
  taxId: "",
  contactName: "",
  email: "",
  phone: "",
  segment: "",
  status: "lead",
  notes: "",
};

export const CLIENTS_TABLE_HEADERS = [
  "Cliente",
  "Contato",
  "Segmento",
  "Projetos",
  "Situação",
  "Desde",
];
