'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email atau password salah.'); setLoading(false); return }
    router.push('/dashboard'); router.refresh()
  }

  const inputCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Lapisan 1: foto kantor */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/kantor.jpg)' }}
      />
      {/* Lapisan 2: gradasi navy menutup foto, menyisakan ±20% foto terlihat */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(30,58,107,0.86) 0%, rgba(19,35,77,0.9) 100%)' }}
      />
      {/* Hiasan lingkaran */}
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-white/5" />
      <div className="absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full bg-white/5" />

      {/* Kartu login */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          <img
            src="/logo-simponik.png"
            alt="SIMPONIK — Sistem Informasi Pelaporan Capaian Kinerja"
            className="mx-auto mb-8 w-full max-w-[280px] h-auto"
          />

          <h1 className="text-2xl font-bold text-slate-900 text-center">Selamat datang</h1>
          <p className="text-sm text-slate-500 mt-1 mb-6 text-center">
            Masuk untuk melanjutkan ke sistem pelaporan kinerja.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className={inputCls} placeholder="nama@imigrasi.go.id" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className={inputCls} placeholder="••••••••" />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 text-sm transition">
              {loading ? 'Memproses…' : 'Masuk'}
            </button>
          </form>
        </div>

        {/* Footer dirapikan: dua baris terpisah & sejajar tengah */}
        <div className="text-center mt-6 space-y-0.5">
          <p className="text-xs text-white/70">Akun didaftarkan oleh administrator</p>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun</p>
        </div>
      </div>
    </div>
  )
}