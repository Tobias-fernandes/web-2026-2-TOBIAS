import type { Cycle } from '@/domain/types'

/** The management that just ended, kept so one board can be compared to the next. */
export const PREVIOUS_CYCLE_ID = 'cyc-2025'

/** The management in progress — the default scope of every screen. */
export const CURRENT_CYCLE_ID = 'cyc-2026'

/**
 * A management runs for a year, which is how a junior enterprise elects its
 * board: one directorate takes office, runs a calendar year and hands over.
 *
 * The closed one carries the date it actually ended; the open one carries null,
 * because that day has not happened yet.
 */
export const SEED_CYCLES: Cycle[] = [
  {
    id: PREVIOUS_CYCLE_ID,
    startsAt: '2025-02-03',
    endsAt: '2025-12-19',
    status: 'closed',
    goals: {
      revenueCents: 900_000,
      projects: 3,
      members: 8,
      npsScore: 8.5,
    },
    createdAt: '2025-01-20',
  },
  {
    id: CURRENT_CYCLE_ID,
    startsAt: '2026-02-02',
    // Em andamento: a diretoria ainda não sabe o dia em que entrega o bastão.
    endsAt: null,
    status: 'active',
    goals: {
      revenueCents: 3_800_000,
      projects: 8,
      members: 14,
      npsScore: 9,
    },
    createdAt: '2025-12-08',
  },
]
