import { useState } from "react";
import { useFormDialog } from "@/components/ui";
import { CLIENT_STATUS_LABELS } from "@/domain/constants";
import { onlyDigits } from "@/lib/document";
import { zodValidate } from "@/lib/validation";
import {
  useClients,
  useCreateClient,
  useProjects,
  useUpdateClient,
} from "@/queries";
import { toast, toastMutationError } from "@/stores/toast";
import { EMPTY_CLIENT_FORM } from "./constants";
import { clientFormSchema } from "./schemas";
import type { ClientsPageState } from "./types";

export function useClientsPage(): ClientsPageState {
  const clients = useClients();
  const projects = useProjects();
  const updateClient = useUpdateClient();

  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();

  const dialog = useFormDialog({
    initial: () => EMPTY_CLIENT_FORM,
    mutation: useCreateClient(),
    validate: (form) => zodValidate(clientFormSchema, form),
    toInput: (form) => ({
      ...form,
      name: form.name.trim(),
      taxId: form.taxId.trim() ? onlyDigits(form.taxId) : null,
      phone: onlyDigits(form.phone),
    }),
    successMessage: () => "Cliente cadastrado.",
  });

  return {
    clients,
    rows: (clients.data ?? []).filter(
      (client) =>
        !term ||
        client.name.toLowerCase().includes(term) ||
        client.contactName.toLowerCase().includes(term) ||
        client.segment.toLowerCase().includes(term),
    ),
    search,
    setSearch,
    searching: term.length > 0,
    projectCount: (clientId) =>
      (projects.data ?? []).filter((project) => project.clientId === clientId)
        .length,
    updating: updateClient.isPending,
    changeStatus: (client, status) =>
      updateClient.mutate(
        { id: client.id, input: { status } },
        {
          onSuccess: () =>
            toast.success(
              `${client.name}: status alterado para ${CLIENT_STATUS_LABELS[status]}.`,
            ),
          onError: (cause) => toastMutationError(cause),
        },
      ),
    dialog,
  };
}
