import type { ColorToken, FontToken, TextToken } from './types'

/**
 * Mirror of the token blocks in `src/index.css`.
 *
 * Duplicated on purpose: Storybook cannot read CSS custom properties as data,
 * and having the palette written down is what makes it reviewable. If a token
 * changes in index.css, change it here too.
 *
 * Each token is a role rather than a colour, which is what lets the dark theme
 * be a swap of values in one file instead of a `dark:` class on every element.
 */
export const COLOR_TOKENS: ColorToken[] = [
  {
    name: 'tinta',
    hex: '#1b1930',
    darkHex: '#eae8f6',
    usage: 'Texto principal e botões de contorno',
  },
  {
    name: 'tinta-suave',
    hex: '#55536e',
    darkHex: '#a09dba',
    usage: 'Texto secundário e legendas',
  },
  { name: 'papel', hex: '#f4f4f8', darkHex: '#131220', usage: 'Fundo da página' },
  {
    name: 'papel-alto',
    hex: '#ffffff',
    darkHex: '#1b1a2b',
    usage: 'Cartões, tabelas e barras',
  },
  { name: 'linha', hex: '#dedfeb', darkHex: '#302e46', usage: 'Bordas e divisores' },
  {
    name: 'violeta',
    hex: '#5b34d9',
    darkHex: '#ab92f8',
    usage: 'Texto de ação, links, foco e barras de progresso',
  },
  {
    name: 'violeta-forte',
    hex: '#5b34d9',
    darkHex: '#6d4ce2',
    usage: 'Superfície que carrega texto branco (botão principal, marca)',
  },
  {
    name: 'violeta-escuro',
    hex: '#4a28bc',
    darkHex: '#7f61ea',
    usage: 'Hover da superfície principal',
  },
  {
    name: 'violeta-lav',
    hex: '#ece7fb',
    darkHex: '#2c2449',
    usage: 'Fundo de selo e item ativo do menu',
  },
  { name: 'verde', hex: '#1a7355', darkHex: '#63d3a7', usage: 'Estado concluído' },
  {
    name: 'verde-lav',
    hex: '#ddf0e8',
    darkHex: '#16372c',
    usage: 'Fundo do estado concluído',
  },
  {
    name: 'ambar',
    hex: '#9c5d0c',
    darkHex: '#e9b070',
    usage: 'Atenção, prazo curto e erro de formulário',
  },
  {
    name: 'ambar-lav',
    hex: '#f7ecd9',
    darkHex: '#3b2d18',
    usage: 'Fundo do estado de atenção',
  },
  {
    name: 'vermelho',
    hex: '#bb2a21',
    darkHex: '#f08a80',
    usage: 'Texto e borda de ação destrutiva',
  },
  {
    name: 'vermelho-forte',
    hex: '#c0281f',
    darkHex: '#c0433a',
    usage: 'Preenchimento da ação destrutiva, com texto branco',
  },
]

export const FONT_TOKENS: FontToken[] = [
  {
    name: 'display',
    stack: 'Bricolage Grotesque',
    usage: 'Títulos do sistema, números de destaque e a marca',
    className: 'font-display',
    bold: true,
  },
  {
    name: 'sans',
    stack: 'IBM Plex Sans',
    usage: 'Corpo de texto, formulários e tabelas',
    className: 'font-sans',
    bold: true,
  },
  {
    name: 'destaque',
    stack: 'Plus Jakarta Sans',
    usage:
      'Só nos títulos grandes da página pública, em 800 na capa e 700 nas seções. Não aparece em nenhuma tela do sistema.',
    className: 'font-destaque',
    bold: true,
  },
]

/**
 * The nine steps of the type scale.
 *
 * The screens used to carry twenty-two arbitrary sizes; listing the scale here
 * is what keeps a twenty-third from being invented.
 */
export const TEXT_TOKENS: TextToken[] = [
  { name: 'text-2xs', size: '12px', usage: 'Selos, legendas de avatar, rótulos do menu' },
  { name: 'text-xs', size: '13px', usage: 'Dicas, notas de rodapé e cabeçalho de tabela' },
  { name: 'text-sm', size: '14px', usage: 'Texto secundário e células de tabela' },
  { name: 'text-base', size: '15px', usage: 'Texto padrão da interface' },
  { name: 'text-md', size: '16px', usage: 'Título de cartão e ênfase' },
  { name: 'text-lg', size: '18px', usage: 'Título de seção' },
  { name: 'text-xl', size: '22px', usage: 'Título de diálogo e destaques' },
  { name: 'text-2xl', size: '28px', usage: 'Título de página e números do painel' },
  { name: 'text-3xl', size: '34px', usage: 'Título da página pública' },
]
