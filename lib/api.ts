import type { DashboardData, UsageChartData, GeneratedToken } from '@/types';

const BASE_URL = '/backend';

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch(`${BASE_URL}/api/admin/dashboard`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

export async function fetchUsageChart(): Promise<UsageChartData> {
  const res = await fetch(`${BASE_URL}/api/admin/usage-chart`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch usage chart');
  return res.json();
}

export async function setValve(pelangganId: string, valve: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/valve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pelanggan_id: pelangganId, valve }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Gagal mengubah status valve');
  }
}

export async function generateToken(nilai: 10 | 20): Promise<GeneratedToken> {
  const res = await fetch(`${BASE_URL}/api/admin/generate-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nilai }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Gagal generate token');
  }
  const data = await res.json();
  return { ...data, timestamp: new Date().toISOString() };
}
