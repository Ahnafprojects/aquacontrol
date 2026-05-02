'use client';

import type { Summary } from '@/types';

interface Props {
  summary: Summary;
}

interface CardConfig {
  label: string;
  value: string;
  sub: string;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
  borderColor: string;
}

function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function OffIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18.36 6.64a9 9 0 11-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default function SummaryCards({ summary }: Props) {
  const cards: CardConfig[] = [
    {
      label: 'Pelanggan Aktif',
      value: String(summary.total_aktif),
      sub: 'valve terbuka',
      color: '#00e5a0',
      glowColor: 'rgba(0,229,160,0.15)',
      borderColor: 'rgba(0,229,160,0.2)',
      icon: <UsersIcon />,
    },
    {
      label: 'Pelanggan Nonaktif',
      value: String(summary.total_nonaktif),
      sub: 'valve tertutup',
      color: '#ff4c6a',
      glowColor: 'rgba(255,76,106,0.15)',
      borderColor: 'rgba(255,76,106,0.2)',
      icon: <OffIcon />,
    },
    {
      label: 'Volume Hari Ini',
      value: summary.total_volume_hari_ini.toLocaleString('id-ID', { maximumFractionDigits: 1 }),
      sub: 'liter terpakai',
      color: '#00d4ff',
      glowColor: 'rgba(0,212,255,0.15)',
      borderColor: 'rgba(0,212,255,0.2)',
      icon: <DropIcon />,
    },
    {
      label: 'Saldo Beredar',
      value: summary.total_saldo_beredar.toLocaleString('id-ID', { maximumFractionDigits: 1 }),
      sub: 'kredit aktif',
      color: '#ffd166',
      glowColor: 'rgba(255,209,102,0.15)',
      borderColor: 'rgba(255,209,102,0.2)',
      icon: <CoinIcon />,
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
    }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: '#111827',
            border: `1px solid ${card.borderColor}`,
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            boxShadow: `0 0 20px ${card.glowColor}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#7a9bb5',
            }}>
              {card.label}
            </p>
            <span style={{ color: card.color, opacity: 0.8 }}>{card.icon}</span>
          </div>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '2rem',
            fontWeight: 700,
            color: card.color,
            lineHeight: 1,
            marginBottom: '0.35rem',
            filter: `drop-shadow(0 0 8px ${card.color}60)`,
          }}>
            {card.value}
          </p>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.7rem',
            color: '#3d5a73',
            letterSpacing: '0.05em',
          }}>
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
