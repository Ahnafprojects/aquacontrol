'use client';

import { useState, useEffect } from 'react';
import { generateToken } from '@/lib/api';
import type { GeneratedToken } from '@/types';

const HISTORY_KEY = 'aquacontrol_token_history';

function loadTodayHistory(): GeneratedToken[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const all: GeneratedToken[] = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    return all.filter((t) => t.timestamp.startsWith(today));
  } catch {
    return [];
  }
}

function saveHistory(tokens: GeneratedToken[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(tokens));
}

export default function TokenGenerator() {
  const [nilai, setNilai] = useState<10 | 20>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestToken, setLatestToken] = useState<GeneratedToken | null>(null);
  const [history, setHistory] = useState<GeneratedToken[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHistory(loadTodayHistory());
  }, []);

  async function handleGenerate() {
    setError('');
    setLoading(true);
    try {
      const token = await generateToken(nilai);
      setLatestToken(token);
      const newHistory = [token, ...history].slice(0, 50);
      setHistory(newHistory);
      saveHistory(newHistory);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal generate token');
    } finally {
      setLoading(false);
    }
  }

  function copyToken() {
    if (!latestToken) return;
    navigator.clipboard.writeText(latestToken.token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Left: Generator */}
      <div>
        {/* Nilai selector */}
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#7a9bb5',
          marginBottom: '0.75rem',
        }}>
          Pilih Nilai Token
        </p>

        <div className="value-select" style={{ marginBottom: '1.5rem' }}>
          {([10, 20] as const).map((val) => (
            <button
              key={val}
              className={`value-option${nilai === val ? ' selected' : ''}`}
              onClick={() => setNilai(val)}
            >
              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '1.75rem',
                fontWeight: 700,
                color: nilai === val ? '#00d4ff' : '#7a9bb5',
                marginBottom: '0.25rem',
              }}>
                {val}
              </p>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: nilai === val ? '#00d4ff' : '#3d5a73',
                marginBottom: '0.5rem',
              }}>
                Kredit
              </p>
              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.75rem',
                color: nilai === val ? '#e8f4f8' : '#3d5a73',
              }}>
                = {val * 10} liter
              </p>
            </button>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading}
          style={{ width: '100%', padding: '1rem', fontSize: '0.95rem' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Generating...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              GENERATE TOKEN
            </span>
          )}
        </button>

        {error && (
          <div style={{
            marginTop: '0.75rem',
            background: 'rgba(255,76,106,0.1)',
            border: '1px solid rgba(255,76,106,0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#ff4c6a',
            fontSize: '0.82rem',
          }}>
            {error}
          </div>
        )}

        {/* Latest Token Display */}
        {latestToken && (
          <div style={{
            marginTop: '1.5rem',
            background: 'rgba(0,212,255,0.05)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#7a9bb5',
              marginBottom: '0.75rem',
            }}>
              Token Baru
            </p>

            <div className="token-display" style={{ marginBottom: '0.75rem' }}>
              {latestToken.token}
            </div>

            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.75rem',
              color: '#7a9bb5',
              marginBottom: '1rem',
            }}>
              {latestToken.nilai} kredit · {latestToken.nilai * 10} liter
            </p>

            <button
              onClick={copyToken}
              className="btn-ghost"
              style={{ width: '100%' }}
            >
              {copied ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#00e5a0' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Tersalin!
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Salin Token
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right: History */}
      <div>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#7a9bb5',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>History Hari Ini</span>
          <span style={{
            background: 'rgba(0,212,255,0.1)',
            color: '#00d4ff',
            borderRadius: '999px',
            padding: '2px 10px',
            fontSize: '0.65rem',
          }}>
            {history.length}
          </span>
        </p>

        <div style={{
          background: '#0d1526',
          border: '1px solid #1a2540',
          borderRadius: '10px',
          maxHeight: '380px',
          overflowY: 'auto',
        }}>
          {history.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#3d5a73',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.8rem',
            }}>
              Belum ada token hari ini
            </div>
          ) : (
            history.map((t, i) => (
              <div
                key={`${t.token}-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderBottom: i < history.length - 1 ? '1px solid rgba(26,37,64,0.6)' : 'none',
                }}
              >
                <div>
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#00d4ff',
                    letterSpacing: '0.2em',
                  }}>
                    {t.token}
                  </p>
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.68rem',
                    color: '#3d5a73',
                    marginTop: '2px',
                  }}>
                    {new Date(t.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#ffd166',
                  }}>
                    {t.nilai} cr
                  </p>
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.65rem',
                    color: '#3d5a73',
                  }}>
                    {t.nilai * 10} L
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
