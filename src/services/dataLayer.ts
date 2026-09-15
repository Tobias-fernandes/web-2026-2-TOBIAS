import { env, isUsingMockData } from '@/config/env'
import { apiDataLayer } from './aws'
import { mockDataLayer } from './mock'
import type { DataLayer } from './types'

/**
 * Single entry point for data access.
 *
 * The query hooks import from here and never from an adapter directly, so
 * switching the demo for the real API is only a matter of setting
 * VITE_DATA_SOURCE=aws and VITE_API_URL in the Amplify environment.
 */
export const dataLayer: DataLayer = isUsingMockData ? mockDataLayer : apiDataLayer

export const currentDataSource = env.dataSource
