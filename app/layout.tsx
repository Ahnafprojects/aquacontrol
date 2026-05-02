import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AquaControl — Sistem Monitoring Air Cerdas Aquantum',
  description: 'Admin dashboard PDAM untuk sistem Aquantum',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
