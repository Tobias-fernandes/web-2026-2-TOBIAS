import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { isUsingMockData } from '@/config/env'
import { MEMBER_ROLE_LABELS } from '@/domain/constants'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useCurrentUser, useSignOut } from '@/stores/auth'
import { Brand } from '@/components/layout/Brand'
import { APP_NAV_ITEMS } from './constants'

export function AppLayout() {
  const user = useCurrentUser()
  const signOut = useSignOut()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-papel lg:grid lg:grid-cols-[236px_1fr]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-violeta focus:px-3 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <aside className="border-b border-linha bg-papel-alto lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block">
          <Brand to="/app" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            className="rounded-[4px] border border-linha px-3 py-1.5 text-sm text-tinta-suave lg:hidden"
          >
            Menu
          </button>
        </div>

        <nav
          aria-label="Seções do sistema"
          className={cn('px-3 pb-4 lg:block', menuOpen ? 'block' : 'hidden')}
        >
          <ul className="flex flex-col gap-0.5">
            {APP_NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-[4px] px-3 py-2 text-[0.95rem] no-underline transition-colors',
                      isActive
                        ? 'bg-violeta-lav font-semibold text-violeta'
                        : 'text-tinta-suave hover:bg-papel hover:text-tinta',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {isUsingMockData && (
            <p className="mt-6 rounded-[4px] border border-linha bg-papel px-3 py-2.5 text-[0.76rem] leading-snug text-tinta-suave">
              <strong className="font-semibold text-tinta">
                Dados de demonstração.
              </strong>{' '}
              A camada de serviços está pronta para a API na AWS — troque
              <code className="mx-1 rounded bg-papel-alto px-1">
                VITE_DATA_SOURCE
              </code>
              para <code className="rounded bg-papel-alto px-1">aws</code>.
            </p>
          )}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-linha bg-papel-alto px-5 py-3">
          <NavLink
            to="/"
            className="text-[0.86rem] text-tinta-suave no-underline hover:text-violeta"
          >
            ← Página pública
          </NavLink>

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="m-0 text-[0.86rem] font-semibold">{user?.name}</p>
              <p className="m-0 text-[0.74rem] text-tinta-suave">
                {user ? MEMBER_ROLE_LABELS[user.role] : ''}
              </p>
            </div>
            <span
              aria-hidden
              className="grid size-9 place-items-center rounded-full bg-violeta-lav text-[0.78rem] font-semibold text-violeta"
            >
              {getInitials(user?.name ?? '')}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-[4px] border border-linha px-3 py-1.5 text-[0.84rem] text-tinta-suave hover:border-tinta hover:text-tinta"
            >
              Sair
            </button>
          </div>
        </header>

        <main id="content" className="min-w-0 flex-1 px-5 py-7 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
