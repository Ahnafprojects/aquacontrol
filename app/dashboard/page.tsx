'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, logout } from '@/lib/auth';
import { fetchDashboard, fetchUsageChart } from '@/lib/api';
import SummaryCards from '@/components/SummaryCards';
import PelangganTable from '@/components/PelangganTable';
import UsageChart from '@/components/UsageChart';
import type { DashboardData, UsageChartData } from '@/types';

function RealtimeClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div style={{ textAlign: 'right' }}>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#00d4ff', letterSpacing: '0.05em' }}>
        {timeStr}
      </p>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d5a73', letterSpacing: '0.06em' }}>
        {dateStr}
      </p>
    </div>
  );
}

function PulsingDot() {
  return (
    <span
      className="pulse-aqua"
      style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#00d4ff',
        flexShrink: 0,
      }}
    />
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [chartData, setChartData] = useState<UsageChartData | null>(null);
  const [error, setError] = useState('');
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/');
  }, [router]);

  const doFetch = useCallback(async () => {
    try {
      const [dash, chart] = await Promise.all([fetchDashboard(), fetchUsageChart()]);
      setDashboard(dash);
      setChartData(chart);
      setLastFetch(new Date());
      setError('');
    } catch {
      setError('Gagal terhubung ke backend. Pastikan server berjalan di port 3000.');
    }
  }, []);

  useEffect(() => {
    doFetch();
    const id = setInterval(doFetch, 3000);
    return () => clearInterval(id);
  }, [doFetch]);

  function handleLogout() {
    logout();
    router.replace('/');
  }

  return (
    <div className="grid-bg scanline" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Header ───────────────────────────────────────── */}
      <header style={{
        background: 'rgba(13,21,38,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a2540',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0 1.5rem',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '38px', height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0090b8, #00d4ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0,212,255,0.3)',
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 6c-1.5 2-4 4.5-4 7a4 4 0 008 0c0-2.5-2.5-5-4-7z" fill="#0a0f1e" />
                <circle cx="12" cy="13" r="2" fill="#0a0f1e" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#e8f4f8', letterSpacing: '0.04em', lineHeight: 1 }}>
                Aqua<span style={{ color: '#00d4ff' }}>Control</span>
              </h1>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#3d5a73', letterSpacing: '0.08em', marginTop: '2px' }}>
                PDAM · AQUANTUM ADMIN
              </p>
            </div>

            {/* Nav */}
            <nav style={{ display: 'flex', gap: '0.25rem', marginLeft: '1rem' }}>
              <Link href="/dashboard" className="nav-tab active">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                Dashboard
              </Link>
              <Link href="/generate-token" className="nav-tab">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Generate Token
              </Link>
            </nav>
          </div>

          {/* Right: Clock + status + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Live indicator */}
            {lastFetch && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <PulsingDot />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: '#3d5a73' }}>
                  LIVE
                </span>
              </div>
            )}

            <RealtimeClock />

            <button
              onClick={handleLogout}
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────── */}
      <main style={{ flex: 1, padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Error */}
        {error && (
          <div style={{
            marginBottom: '1rem',
            background: 'rgba(255,76,106,0.1)',
            border: '1px solid rgba(255,76,106,0.3)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            color: '#ff4c6a',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.82rem',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18h20.36L10.29 3.86z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {error}
          </div>
        )}

        {/* Skeleton / loading state */}
        {!dashboard && !error && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#3d5a73' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: '3px solid #1a2540',
              borderTopColor: '#00d4ff',
              margin: '0 auto 1rem',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', letterSpacing: '0.1em' }}>
              Menghubungkan ke server...
            </p>
          </div>
        )}

        {dashboard && (
          <>
            {/* Summary Cards */}
            <section style={{ marginBottom: '1.5rem' }}>
              <SummaryCards summary={dashboard.summary} />
            </section>

            {/* Chart */}
            <section style={{ marginBottom: '1.5rem' }}>
              <div className="card-aqua" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#e8f4f8', letterSpacing: '0.02em' }}>
                      Grafik Pemakaian Air
                    </h2>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.68rem', color: '#3d5a73', marginTop: '2px' }}>
                      7 hari terakhir — satuan liter
                    </p>
                  </div>
                  <div style={{
                    background: 'rgba(0,212,255,0.08)',
                    border: '1px solid rgba(0,212,255,0.15)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.65rem',
                    color: '#00d4ff',
                  }}>
                    DAILY
                  </div>
                </div>
                {chartData && <UsageChart data={chartData} />}
              </div>
            </section>

            {/* Pelanggan Table */}
            <section>
              <div className="card-aqua" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#e8f4f8' }}>
                      Data Pelanggan
                    </h2>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.68rem', color: '#3d5a73', marginTop: '2px' }}>
                      Real-time · polling 3 detik
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PulsingDot />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d5a73' }}>
                      {dashboard.pelanggan.length} pelanggan
                    </span>
                  </div>
                </div>
                <PelangganTable pelanggan={dashboard.pelanggan} onRefresh={doFetch} />
              </div>
            </section>
          </>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #1a2540',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: '#3d5a73' }}>
          AquaControl · PDAM Aquantum Monitoring System
        </p>
        {lastFetch && (
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: '#3d5a73' }}>
            Update terakhir: {lastFetch.toLocaleTimeString('id-ID')}
          </p>
        )}
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
