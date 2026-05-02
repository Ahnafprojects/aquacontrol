export interface Pelanggan {
  id: string;
  nama: string;
  alamat: string;
  saldo: number;
  volume: number;
  flowRate: number;
  valve: boolean;
  lastUpdate: string;
}

export interface Summary {
  total_aktif: number;
  total_nonaktif: number;
  total_volume_hari_ini: number;
  total_saldo_beredar: number;
}

export interface DashboardData {
  pelanggan: Pelanggan[];
  summary: Summary;
}

export interface UsageDay {
  tanggal: string;
  volume: number;
  saldo_terpakai: number;
}

export interface PerPelangganUsage {
  pelanggan_id: string;
  nama: string;
  data: UsageDay[];
}

export interface AggregateUsage {
  tanggal: string;
  total_volume: number;
}

export interface UsageChartData {
  per_pelanggan: PerPelangganUsage[];
  aggregate: AggregateUsage[];
}

export interface GeneratedToken {
  token: string;
  nilai: number;
  message: string;
  timestamp: string;
}
