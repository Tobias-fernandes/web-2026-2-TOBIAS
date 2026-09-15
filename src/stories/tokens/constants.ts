import type { ColorToken, FontToken } from './types'

/**
 * Mirror of the `@theme` block in `src/index.css`.
 *
 * Duplicated on purpose: Storybook cannot read CSS custom properties as data,
 * and having the palette written down is what makes it reviewable. If a token
 * changes in index.css, change it here too.
 */
export const COLOR_TOKENS: ColorToken[] = [
  { name: 'tinta', hex: '#191735', usage: 'Texto principal e botões de contorno' },
  { name: 'tinta-suave', hex: '#4e4c6b', usage: 'Texto secundário e legendas' },
  { name: 'papel', hex: '#f2f3f7', usage: 'Fundo da página' },
  { name: 'papel-alto', hex: '#ffffff', usage: 'Cartões, tabelas e barras' },
  { name: 'violeta', hex: '#5b34d9', usage: 'Ação principal, links e foco' },
  { name: 'violeta-escuro', hex: '#4a28bc', usage: 'Hover da ação principal' },
  { name: 'violeta-lav', hex: '#ebe5fb', usage: 'Fundo de selo e item ativo do menu' },
  { name: 'linha', hex: '#d5d6e3', usage: 'Bordas e divisores' },
  { name: 'verde', hex: '#1f7a5c', usage: 'Estado concluído' },
  { name: 'verde-lav', hex: '#dcf0e8', usage: 'Fundo do estado concluído' },
  { name: 'ambar', hex: '#b06a12', usage: 'Atenção, prazo curto e erro de formulário' },
  { name: 'ambar-lav', hex: '#f6ead6', usage: 'Fundo do estado de atenção' },
]

export const FONT_TOKENS: FontToken[] = [
  {
    name: 'display',
    stack: 'Bricolage Grotesque',
    usage: 'Títulos, números de destaque e a marca',
    className: 'font-display',
  },
  {
    name: 'sans',
    stack: 'IBM Plex Sans',
    usage: 'Corpo de texto, formulários e tabelas',
    className: 'font-sans',
  },
]
