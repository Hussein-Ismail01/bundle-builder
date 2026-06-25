import axios from 'axios'

/**
 * Shared axios instance. Base URL is `/api`, which Vite proxies to the
 * Express server during dev (see vite.config.ts).
 */
export const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})
