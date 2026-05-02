'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, logout } from '@/lib/auth';
import TokenGenerator from '@/components/TokenGenerator';

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

export default function GenerateTokenPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/');
  }, [router]);

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
              <Link href="/dashboard" className="nav-tab">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                Dashboard
              </Link>
              <Link href="/generate-token" className="nav-tab active">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Generate Token
              </Link>
            </nav>
          </div>

          {/* Right: Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

      {/* ── Main ─────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '9px',
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#e8f4f8' }}>
              Generate Token
            </h2>
          </div>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', color: '#3d5a73', letterSpacing: '0.04em' }}>
            Buat kode token 4 digit untuk topup saldo pelanggan
          </p>
        </div>

        {/* Token Generator Card */}
        <div className="card-aqua" style={{ padding: '1.75rem' }}>
          {/* Konversi info */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem',
            background: 'rgba(0,212,255,0.04)',
            border: '1px solid rgba(0,212,255,0.1)',
            borderRadius: '8px',
          }}>
            <PulsingDot />
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.72rem', fontWeight: 600, color: '#00d4ff', letterSpacing: '0.08em', marginBottom: '2px' }}>
                KONVERSI SALDO
              </p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.78rem', color: '#7a9bb5' }}>
                1 kredit = 10 liter air &nbsp;·&nbsp; Token 10 cr = 100 liter &nbsp;·&nbsp; Token 20 cr = 200 liter
              </p>
            </div>
          </div>

          <TokenGenerator />
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #1a2540',
        padding: '0.75rem 1.5rem',
      }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: '#3d5a73' }}>
          AquaControl · PDAM Aquantum Monitoring System
        </p>
      </footer>
    </div>
  );
}
