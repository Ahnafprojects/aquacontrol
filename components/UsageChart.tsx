'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { UsageChartData } from '@/types';

interface Props {
  data: UsageChartData;
}

const PELANGGAN_COLORS = ['#00d4ff', '#00e5a0', '#ffd166', '#ff4c6a', '#b388ff', '#f48fb1'];

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#111827',
      border: '1px solid #1a2540',
      borderRadius: '10px',
      padding: '0.75rem 1rem',
      boxShadow: '0 0 20px rgba(0,212,255,0.15)',
    }}>
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#7a9bb5',
        marginBottom: '0.5rem',
      }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: '#e8f4f8' }}>
            {entry.name}: <strong style={{ color: entry.color }}>{entry.value.toFixed(1)} L</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function UsageChart({ data }: Props) {
  const [mode, setMode] = useState<'aggregate' | 'per-pelanggan'>('aggregate');

  // Build chart data
  const chartData = data.aggregate.map((agg) => {
    const row: Record<string, string | number> = {
      tanggal: agg.tanggal.slice(5), // MM-DD
      'Semua Pelanggan': agg.total_volume,
    };
    if (mode === 'per-pelanggan') {
      data.per_pelanggan.forEach((pp) => {
        const day = pp.data.find((d) => d.tanggal === agg.tanggal);
        row[pp.nama] = day?.volume ?? 0;
      });
    }
    return row;
  });

  const lines =
    mode === 'aggregate'
      ? [{ key: 'Semua Pelanggan', color: '#00d4ff' }]
      : data.per_pelanggan.map((pp, i) => ({
          key: pp.nama,
          color: PELANGGAN_COLORS[i % PELANGGAN_COLORS.length],
        }));

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setMode('aggregate')}
          className={`nav-tab${mode === 'aggregate' ? ' active' : ''}`}
          style={{ fontSize: '0.75rem' }}
        >
          Semua Pelanggan
        </button>
        <button
          onClick={() => setMode('per-pelanggan')}
          className={`nav-tab${mode === 'per-pelanggan' ? ' active' : ''}`}
          style={{ fontSize: '0.75rem' }}
        >
          Per Pelanggan
        </button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(26,37,64,0.8)"
            vertical={false}
          />
          <XAxis
            dataKey="tanggal"
            tick={{ fill: '#3d5a73', fontSize: 11, fontFamily: 'Space Mono, monospace' }}
            axisLine={{ stroke: '#1a2540' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#3d5a73', fontSize: 11, fontFamily: 'Space Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}L`}
          />
          <Tooltip content={<CustomTooltip />} />
          {mode === 'per-pelanggan' && (
            <Legend
              wrapperStyle={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '0.72rem',
                color: '#7a9bb5',
                paddingTop: '0.75rem',
              }}
            />
          )}
          {lines.map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              stroke={l.color}
              strokeWidth={2}
              dot={{ r: 3, fill: l.color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: l.color, strokeWidth: 2, stroke: '#0a0f1e' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
