import type { Meta, StoryObj } from '@storybook/react-vite'
import { COLOR_TOKENS, FONT_TOKENS, TEXT_TOKENS } from './constants'

/**
 * Reference sheet for the design tokens, so a new screen reaches for an existing
 * token instead of inventing a colour or a font size.
 */
function Palette() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {COLOR_TOKENS.map((token) => (
        <div
          key={token.name}
          className="rounded-xl border border-linha bg-papel-alto p-4"
        >
          <div className="flex items-center gap-3">
            {/* The two chips side by side: the same role, in each theme. */}
            <span
              aria-hidden
              className="flex size-10 shrink-0 overflow-hidden rounded-md border border-linha"
            >
              <span className="w-1/2" style={{ backgroundColor: token.hex }} />
              <span className="w-1/2" style={{ backgroundColor: token.darkHex }} />
            </span>
            <div className="min-w-0">
              <p className="m-0 font-display text-sm font-bold">{token.name}</p>
              <p className="m-0 font-mono text-2xs text-tinta-suave">
                {token.hex} · {token.darkHex}
              </p>
            </div>
          </div>
          <p className="m-0 mt-2.5 text-xs leading-relaxed text-tinta-suave">
            {token.usage}
          </p>
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
          className="rounded-xl border border-linha bg-papel-alto p-5"
        >
          <p className="m-0 text-2xs font-semibold text-tinta-suave">
            {token.className} · {token.stack}
          </p>
          <p
            className={`m-0 mt-2 text-2xl ${token.bold ? 'font-bold' : 'font-normal'} ${token.className}`}
          >
            A gestão da sua empresa júnior
          </p>
          <p className={`m-0 mt-1 ${token.className}`}>
            Projetos, horas de membros, clientes e relatórios em um só lugar.
          </p>
          <p className="m-0 mt-3 text-xs text-tinta-suave">{token.usage}</p>
        </div>
      ))}
    </div>
  )
}

function Scale() {
  return (
    <div className="overflow-hidden rounded-xl border border-linha bg-papel-alto">
      {TEXT_TOKENS.map((token) => (
        <div
          key={token.name}
          className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-linha px-5 py-4 last:border-0"
        >
          <code className="w-28 shrink-0 font-mono text-xs text-violeta">
            {token.name}
          </code>
          <span className="w-12 shrink-0 text-xs text-tinta-suave">
            {token.size}
          </span>
          <span className={token.name}>Horas lançadas nesta gestão</span>
          <span className="w-full text-xs text-tinta-suave">{token.usage}</span>
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
          'Paleta, tipografia e escala tipográfica definidas em `src/index.css`. Os nomes dos ' +
          'tokens ficam em português porque espelham a identidade da página original já publicada. ' +
          'Cada cor é um papel, não um tom: as duas metades do quadrado mostram o valor que aquele ' +
          'papel assume no tema claro e no escuro, e é por isso que nenhuma tela precisa de classes `dark:`.',
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

/** Nove degraus, e nada entre eles. */
export const EscalaTipografica: Story = {
  render: () => <Scale />,
}
