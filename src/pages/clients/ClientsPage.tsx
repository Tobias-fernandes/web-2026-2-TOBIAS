import { PageHeader } from "@/components/layout";
import {
  Button,
  EmptyState,
  FormDialog,
  ListState,
  SkeletonTable,
  StatusSelect,
  Table,
  TableCell,
  TableRow,
  TextField,
  labelOptions,
} from "@/components/ui";
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_TONES } from "@/domain/constants";
import { formatCnpj } from "@/lib/document";
import { formatDate } from "@/lib/format";
import { ClientForm } from "./ClientForm";
import { useClientsPage } from "./hooks";
import { CLIENTS_TABLE_HEADERS } from "./constants";

const STATUS_OPTIONS = labelOptions(CLIENT_STATUS_LABELS);

const ClientsPage: React.FC = () => {
  const list = useClientsPage();

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Cadastro único de contatos, propostas e status de negociação — que continua na EJ quando a diretoria muda."
        action={
          <Button onClick={() => list.dialog.openWith()}>Novo cliente</Button>
        }
      />

      <div className="mb-5 max-w-md">
        <TextField
          label="Buscar"
          type="search"
          value={list.search}
          onChange={(event) => list.setSearch(event.target.value)}
          placeholder="Nome, contato ou segmento"
        />
      </div>

      <ListState
        query={list.clients}
        rows={list.rows}
        loadingLabel="Carregando clientes…"
        skeleton={<SkeletonTable columns={6} />}
        empty={
          <EmptyState
            title={
              list.searching
                ? "Nenhum cliente encontrado"
                : "Nenhum cliente cadastrado"
            }
            description={
              list.searching
                ? "Tente outro termo de busca."
                : "Cadastre o primeiro contato para começar a acompanhar a prospecção."
            }
            action={
              list.searching ? undefined : (
                <Button onClick={() => list.dialog.openWith()}>
                  Novo cliente
                </Button>
              )
            }
          />
        }
      >
        {(rows) => (
          <Table headers={CLIENTS_TABLE_HEADERS}>
            {rows.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <p className="m-0 font-semibold">{client.name}</p>
                  <p className="m-0 text-xs text-tinta-suave">
                    {client.taxId
                      ? formatCnpj(client.taxId)
                      : "Sem CNPJ cadastrado"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="m-0">{client.contactName}</p>
                  <p className="m-0 text-xs text-tinta-suave">{client.email}</p>
                </TableCell>
                <TableCell className="text-tinta-suave">
                  {client.segment}
                </TableCell>
                <TableCell className="text-center font-display font-bold">
                  {list.projectCount(client.id)}
                </TableCell>
                <TableCell>
                  <StatusSelect
                    value={client.status}
                    tone={CLIENT_STATUS_TONES[client.status]}
                    accessibleLabel={`Situação de ${client.name}`}
                    options={STATUS_OPTIONS}
                    disabled={list.updating}
                    onChange={(status) => list.changeStatus(client, status)}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap text-tinta-suave">
                  {formatDate(client.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </ListState>

      <FormDialog
        open={list.dialog.open}
        title="Novo cliente"
        submitLabel="Cadastrar"
        error={list.dialog.error}
        submitting={list.dialog.submitting}
        onSubmit={list.dialog.submit}
        onClose={list.dialog.close}
      >
        <ClientForm value={list.dialog.form} onChange={list.dialog.setForm} />
      </FormDialog>
    </>
  );
};

export { ClientsPage };
