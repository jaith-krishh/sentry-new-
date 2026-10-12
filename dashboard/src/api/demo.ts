import { fetchJson } from './client';

export interface DemoStatus {
  running: boolean;
  started_at: string | null;
  generated: number;
  last_session_id: string | null;
  interval_sec: number;
  last_error: string | null;
}

export const getDemoStatus = () => fetchJson<DemoStatus>('/demo/status');
export const startDemo = () => fetchJson<DemoStatus>('/demo/start', { method: 'POST' });
export const stopDemo = () => fetchJson<DemoStatus>('/demo/stop', { method: 'POST' });
export const resetDemo = () => fetchJson<DemoStatus>('/demo/reset', { method: 'POST' });
