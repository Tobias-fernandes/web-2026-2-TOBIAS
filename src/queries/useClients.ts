import { createEntityQueries } from "./createEntityQueries";
import { dataLayer } from "@/services";
import { queryKeys } from "./queryKeys";

const clients = createEntityQueries(queryKeys.clients, dataLayer.clients);

export const useClients = clients.useList;
export const useClient = clients.useDetail;
export const useCreateClient = clients.useCreate;
export const useUpdateClient = clients.useUpdate;
