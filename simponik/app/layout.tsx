import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SIMPONIK',
  description: 'Sistem Informasi Pelaporan Kinerja — Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.className} antialiased`}>{children}</body>
    </html>
  )
}