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
    'w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-center py-8">
        <img src="/logo-simponik.png" alt="SIMPONIK" className="h-14 w-auto" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="text-center max-w-lg mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Kinerja terukur,<br />pelayanan terjaga
          </h1>
          <p className="text-slate-500 mt-4">
            Sistem Informasi Pelaporan Capaian Kinerja — Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun
          </p>
          <div className="badge-row justify-center mt-6">
            <span className="badge-pill">4 Seksi Aktif</span>
            <span className="badge-pill">20 Indikator</span>
            <span className="badge-pill">Pemantauan Real-time</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className={inputCls} placeholder="nama@imigrasi.go.id" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className={inputCls} placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-2.5">{error}</p>}
          <button type="submit" disabled={loading} className="btn-pill-solid w-full justify-center py-3">
            {loading ? 'Memproses…' : 'Masuk'}
            {!loading && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8">
          Akun didaftarkan oleh administrator · © {new Date().getFullYear()} Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun
        </p>
      </div>
    </div>
  )
}