'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard');
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (login(username, password)) {
        router.push('/dashboard');
      } else {
        setError('Username atau password salah.');
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="grid-bg scanline min-h-screen flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo / Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {/* Icon */}
          <div style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 1.25rem',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #0090b8, #00d4ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0,212,255,0.35)',
          }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(10,15,30,0.6)" />
              <path d="M12 6c-1.5 2-4 4.5-4 7a4 4 0 008 0c0-2.5-2.5-5-4-7z" fill="#0a0f1e" />
              <circle cx="12" cy="13" r="2" fill="#00d4ff" />
            </svg>
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '2rem',
            fontWeight: 800,
            color: '#e8f4f8',
            letterSpacing: '0.04em',
            marginBottom: '0.4rem',
          }}>
            Aqua<span style={{ color: '#00d4ff' }}>Control</span>
          </h1>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.72rem',
            color: '#7a9bb5',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Sistem Monitoring Air Cerdas Aquantum
          </p>
        </div>

        {/* Card */}
        <div className="card-aqua" style={{ padding: '2rem' }}>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '0.7rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#7a9bb5',
            marginBottom: '1.5rem',
          }}>
            Admin Login
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#7a9bb5',
                marginBottom: '0.5rem',
              }}>
                Username
              </label>
              <input
                className="input-aqua"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#7a9bb5',
                marginBottom: '0.5rem',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-aqua"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#3d5a73',
                    padding: '4px',
                  }}
                >
                  {showPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(255,76,106,0.1)',
                border: '1px solid rgba(255,76,106,0.3)',
                borderRadius: '8px',
                padding: '0.7rem 1rem',
                color: '#ff4c6a',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Masuk...
                </span>
              ) : 'MASUK'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          color: '#3d5a73',
          letterSpacing: '0.06em',
        }}>
          PDAM · AQUANTUM v1.0 · {new Date().getFullYear()}
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
