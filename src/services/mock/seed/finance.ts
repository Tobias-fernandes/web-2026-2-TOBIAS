import type { FinanceEntry } from '@/domain/types'
import { CURRENT_CYCLE_ID, PREVIOUS_CYCLE_ID } from './cycles'

/**
 * Cash flow of the term, as instalments rather than contract totals.
 *
 * A contract signed is not money in the account, and the gap between the two is
 * where a junior enterprise runs out of cash while its dashboard says it is
 * doing well. One row here is one date on which money should move.
 */
export const SEED_FINANCE_ENTRIES: FinanceEntry[] = [
  // ——— A receber ———
  receivable('fin-1', 'Site institucional — 1ª parcela', 240_000, '2026-08-20', '2026-08-21', 'prj-1', 'cli-1'),
  receivable('fin-2', 'Site institucional — 2ª parcela', 240_000, '2026-09-08', null, 'prj-1', 'cli-1'),
  receivable('fin-3', 'App de vistoria — 2ª parcela', 383_334, '2026-09-10', '2026-09-11', 'prj-2', 'cli-2'),
  receivable('fin-4', 'App de vistoria — 3ª parcela', 383_333, '2026-12-05', null, 'prj-2', 'cli-2'),
  receivable('fin-5', 'Painel de indicadores — 1ª parcela', 190_000, '2026-09-05', '2026-09-05', 'prj-3', 'cli-2'),
  receivable('fin-6', 'Painel de indicadores — 2ª parcela', 190_000, '2026-10-10', null, 'prj-3', 'cli-2'),
  receivable('fin-7', 'Catálogo digital — parcela única', 150_000, '2026-09-10', '2026-09-12', 'prj-5', 'cli-1'),
  receivable('fin-8', 'Landing page — entrada', 95_000, '2026-10-01', null, 'prj-4', 'cli-1'),
  {
    ...receivable('fin-9', 'Patrocínio da Semana de Tecnologia', 120_000, '2026-09-30', null, null, null),
    category: 'sponsorship',
  },

  // ——— A pagar ———
  payable('fin-10', 'Contribuição anual à federação', 90_000, '2026-09-20', null, 'federationFee', 'presidency'),
  payable('fin-11', 'Assinaturas de ferramentas (setembro)', 32_000, '2026-09-05', '2026-09-05', 'tooling', 'projects'),
  payable('fin-12', 'Assinaturas de ferramentas (outubro)', 32_000, '2026-10-05', null, 'tooling', 'projects'),
  payable('fin-13', 'Material do processo seletivo 2026', 18_000, '2026-08-28', '2026-08-28', 'event', 'people'),
  payable('fin-14', 'Capacitação de gestão de projetos', 45_000, '2026-09-12', '2026-09-12', 'training', 'people'),
  payable('fin-15', 'Impulsionamento de campanha no Instagram', 15_000, '2026-09-18', null, 'event', 'marketing'),
  payable('fin-16', 'Reembolso de deslocamento — visita à Vale Verde', 8_400, '2026-09-02', '2026-09-04', 'reimbursement', 'commercial'),
  payable('fin-17', 'Taxas bancárias e tributos do trimestre', 26_000, '2026-10-15', null, 'tax', 'finance'),
  {
    // Alguém pagou do próprio bolso e trouxe a nota: sem projeto, sem cliente,
    // já quitado no dia, e com a pessoa a reembolsar registrada.
    ...payable('fin-20', 'Coffee break da reunião geral', 20_000, '2026-09-24', '2026-09-24', 'event', 'presidency'),
    memberId: 'mem-9',
    receiptRef: 'NF 4471 — Panificadora Central',
  },
  {
    ...payable('fin-21', 'Camisetas da equipe', 68_000, '2026-10-02', null, 'other', 'people'),
    receiptRef: 'Orçamento 2026-113',
  },

  // ——— Entradas que não vêm de contrato ———
  {
    ...receivable('fin-22', 'Premiação do Desafio de Inovação da federação', 100_000, '2026-09-19', '2026-09-19', null, null),
    category: 'award',
    memberId: 'mem-1',
    receiptRef: 'Recibo FEJERN 2026/09',
  },
  {
    ...receivable('fin-23', 'Mensalidades dos membros — setembro', 36_000, '2026-09-10', '2026-09-10', null, null),
    category: 'membershipFee',
  },

  // ——— Gestão anterior, mantida para comparar os ciclos ———
  {
    ...receivable('fin-18', 'Automação de relatórios — parcela final', 270_000, '2025-05-30', '2025-06-02', 'prj-6', 'cli-5'),
    cycleId: PREVIOUS_CYCLE_ID,
  },
  {
    ...receivable('fin-19', 'Portal de doações — parcela única', 260_000, '2025-06-15', '2025-06-18', 'prj-7', 'cli-5'),
    cycleId: PREVIOUS_CYCLE_ID,
  },
]

function receivable(
  id: string,
  description: string,
  amountCents: number,
  dueAt: string,
  paidAt: string | null,
  projectId: string | null,
  clientId: string | null,
): FinanceEntry {
  return {
    id,
    cycleId: CURRENT_CYCLE_ID,
    kind: 'receivable',
    category: 'projectInstalment',
    description,
    amountCents,
    dueAt,
    paidAt,
    projectId,
    clientId,
    memberId: null,
    receiptRef: '',
    directorate: 'finance',
    createdBy: 'mem-8',
    createdAt: dueAt,
  }
}

function payable(
  id: string,
  description: string,
  amountCents: number,
  dueAt: string,
  paidAt: string | null,
  category: FinanceEntry['category'],
  directorate: FinanceEntry['directorate'],
): FinanceEntry {
  return {
    id,
    cycleId: CURRENT_CYCLE_ID,
    kind: 'payable',
    category,
    description,
    amountCents,
    dueAt,
    paidAt,
    projectId: null,
    clientId: null,
    memberId: null,
    receiptRef: '',
    directorate,
    createdBy: 'mem-8',
    createdAt: dueAt,
  }
}
