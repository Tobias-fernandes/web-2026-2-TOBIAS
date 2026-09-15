import type { Meta, StoryObj } from '@storybook/react-vite'
import { COLOR_TOKENS, FONT_TOKENS } from './constants'

/**
 * Reference sheet for the design tokens, so a new screen reaches for an existing
 * token instead of inventing a colour.
 */
function Palette() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {COLOR_TOKENS.map((token) => (
        <div
          key={token.name}
          className="flex items-center gap-3 rounded-lg border border-linha bg-papel-alto p-3"
        >
          <span
            aria-hidden
            className="size-10 shrink-0 rounded-md border border-linha"
            style={{ backgroundColor: token.hex }}
          />
          <div className="min-w-0">
            <p className="m-0 font-display text-sm font-bold">{token.name}</p>
            <p className="m-0 font-mono text-[0.72rem] text-tinta-suave uppercase">
              {token.hex}
            </p>
            <p className="m-0 mt-0.5 text-[0.75rem] text-tinta-suave">
              {token.usage}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function Typography() {
  return (
    <div className="flex flex-col gap-4">
      {FONT_TOKENS.map((token) => (
        <div
          key={token.name}
          className="rounded-lg border border-linha bg-papel-alto p-4"
        >
          <p className="m-0 text-[0.72rem] font-semibold tracking-wide text-tinta-suave uppercase">
            {token.className} · {token.stack}
          </p>
          <p className={`m-0 mt-2 text-2xl font-bold ${token.className}`}>
            A gestão da sua empresa júnior
          </p>
          <p className={`m-0 mt-1 ${token.className}`}>
            Projetos, horas de membros, clientes e relatórios em um só lugar.
          </p>
          <p className="m-0 mt-2 text-[0.78rem] text-tinta-suave">{token.usage}</p>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Documentação/Design tokens',
  parameters: {
    docs: {
      description: {
        component:
          'Paleta e tipografia definidas no bloco `@theme` de `src/index.css`. Os nomes dos ' +
          'tokens ficam em português porque espelham a identidade da página original já publicada.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Cores: Story = {
  render: () => <Palette />,
}

export const Tipografia: Story = {
  render: () => <Typography />,
}
