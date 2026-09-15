import type { Client } from '@/domain/types'

/**
 * Sample clients for stories.
 *
 * Kept apart from the seed in `src/services/mock` so a change to the demo data
 * never silently reshapes a story — each fixture here is chosen to exercise one
 * visual state (an active client, a lead without a tax id, a closed one).
 */
export const activeClient: Client = {
  id: 'cli-1',
  name: 'Padaria Pão de Ouro',
  taxId: '12.345.678/0001-90',
  contactName: 'Marta Albuquerque',
  email: 'contato@paodeouro.com.br',
  phone: '(84) 99612-4410',
  segment: 'Alimentício',
  status: 'active',
  notes: 'Indicação de ex-membro. Já contratou dois projetos.',
  createdAt: '2025-11-12',
}

export const leadClient: Client = {
  id: 'cli-4',
  name: 'Sertão Agro Distribuidora',
  taxId: null,
  contactName: 'Emanuel Costa',
  email: 'emanuel@sertaoagro.com',
  phone: '(84) 99155-2203',
  segment: 'Agronegócio',
  status: 'lead',
  notes: 'Contato feito na feira de inovação do campus.',
  createdAt: '2026-09-01',
}

export const negotiatingClient: Client = {
  id: 'cli-3',
  name: 'Clínica Bem Viver',
  taxId: '45.221.900/0001-33',
  contactName: 'Dra. Helena Rios',
  email: 'financeiro@bemviver.com.br',
  phone: '(84) 99430-7781',
  segment: 'Saúde',
  status: 'negotiating',
  notes: 'Proposta enviada. Aguardando retorno da diretoria.',
  createdAt: '2026-08-14',
}

export const clientList: Client[] = [activeClient, negotiatingClient, leadClient]
