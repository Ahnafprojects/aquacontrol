'use client';

import { useState } from 'react';
import type { Pelanggan } from '@/types';
import { setValve } from '@/lib/api';

interface Props {
  pelanggan: Pelanggan[];
  onRefresh?: () => void;
}

function FlowRateCell({ value }: { value: number }) {
  if (value === 0) {
    return <span style={{ color: '#3d5a73', fontFamily: "'Space Mono', monospace" }}>—</span>;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div
        className="flow-active"
        style={{ width: '48px', height: '6px', borderRadius: '3px', background: 'rgba(0,212,255,0.15)' }}
      />
      <span style={{ fontFamily: "'Space Mono', monospace", color: '#00d4ff', fontSize: '0.8rem' }}>
        {value.toFixed(1)} L/m
      </span>
    </div>
  );
}

function ValveToggle({
  pelangganId,
  active,
  onToggled,
}: {
  pelangganId: string;
  active: boolean;
  onToggled: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleToggle() {
    setLoading(true);
    setError('');
    try {
      await setValve(pelangganId, !active);
      onToggled();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      {/* Status badge */}
      {active ? (
        <span className="badge-active">
          <span
            className="pulse-green"
            style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#00e5a0', flexShrink: 0 }}
          />
          AKTIF
        </span>
      ) : (
        <span className="badge-inactive">
          <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#ff4c6a', flexShrink: 0 }} />
          NONAKTIF
        </span>
      )}

      {/* Toggle button */}
      <button
        onClick={handleToggle}
        disabled={loading}
        title={active ? 'Tutup valve' : 'Buka valve'}
        style={{
          width: '32px',
          height: '18px',
          borderRadius: '9px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: active
            ? 'rgba(0,229,160,0.25)'
            : 'rgba(255,76,106,0.15)',
          position: 'relative',
          transition: 'background 0.25s',
          outline: 'none',
          flexShrink: 0,
          opacity: loading ? 0.5 : 1,
          boxShadow: active
            ? '0 0 8px rgba(0,229,160,0.3)'
            : '0 0 8px rgba(255,76,106,0.2)',
        }}
      >
        <span style={{
          position: 'absolute',
          top: '2px',
          left: active ? '16px' : '2px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: active ? '#00e5a0' : '#ff4c6a',
          transition: 'left 0.25s, background 0.25s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {loading && (
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0a0f1e" strokeWidth="3" style={{ animation: 'spin 0.6s linear infinite' }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          )}
        </span>
      </button>

      {/* Inline error */}
      {error && (
        <span style={{ fontSize: '0.65rem', color: '#ff4c6a', fontFamily: "'Space Mono', monospace" }}>
          !
        </span>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function PelangganTable({ pelanggan, onRefresh }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table-aqua">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th style={{ textAlign: 'right' }}>Saldo (Kredit)</th>
            <th style={{ textAlign: 'right' }}>Volume (L)</th>
            <th>Flow Rate</th>
            <th>Status Valve</th>
            <th style={{ textAlign: 'right' }}>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {pelanggan.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', color: '#3d5a73', padding: '2rem' }}>
                Tidak ada data pelanggan
              </td>
            </tr>
          )}
          {pelanggan.map((p) => (
            <tr key={p.id}>
              <td>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  color: '#00d4ff',
                  fontSize: '0.8rem',
                  background: 'rgba(0,212,255,0.08)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,212,255,0.15)',
                }}>
                  {p.id}
                </span>
              </td>
              <td style={{ color: '#e8f4f8', fontWeight: 500 }}>{p.nama}</td>
              <td style={{ color: '#7a9bb5', fontSize: '0.78rem', maxWidth: '180px' }}>{p.alamat}</td>
              <td style={{ textAlign: 'right' }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  color: p.saldo > 0 ? '#ffd166' : '#ff4c6a',
                  fontWeight: 700,
                }}>
                  {p.saldo.toFixed(1)}
                </span>
                <span style={{ color: '#3d5a73', fontSize: '0.7rem', marginLeft: '4px' }}>cr</span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", color: '#e8f4f8' }}>
                  {p.volume.toFixed(1)}
                </span>
                <span style={{ color: '#3d5a73', fontSize: '0.7rem', marginLeft: '4px' }}>L</span>
              </td>
              <td>
                <FlowRateCell value={p.flowRate} />
              </td>
              <td>
                <ValveToggle
                  pelangganId={p.id}
                  active={p.valve}
                  onToggled={() => onRefresh?.()}
                />
              </td>
              <td style={{ textAlign: 'right' }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.72rem',
                  color: '#3d5a73',
                }}>
                  {new Date(p.lastUpdate).toLocaleTimeString('id-ID', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                  })}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
