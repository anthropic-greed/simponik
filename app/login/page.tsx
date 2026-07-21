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
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="relative overflow-hidden lg:w-1/2 min-h-[280px] lg:min-h-screen flex flex-col justify-center px-10 py-16 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/kantor-gerbang.jpg)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(30,58,107,0.62) 0%, rgba(20,38,71,0.68) 100%)' }}
        />
        <div className="blob w-96 h-96 bg-amber-400/20 -top-20 -left-20" />
        <div className="blob w-80 h-80 bg-blue-300/20 bottom-0 right-0" />

        <div className="relative z-10 max-w-md">
          <img src="/logo-simponik.png" alt="SIMPONIK" className="h-[280px] w-auto mb-8" />
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight drop-shadow-md">
            Kinerja terukur,<br />pelayanan terjaga
          </h1>
          <p className="text-blue-50 mt-5 text-lg drop-shadow">
            Satu sistem untuk memantau capaian kinerja seluruh seksi, kapan saja, di mana saja.
          </p>
          <div className="badge-row mt-8">
            <span className="badge-pill !bg-white/15 !text-white !border-white/25">4 Seksi Aktif</span>
            <span className="badge-pill !bg-white/15 !text-white !border-white/25">20 Indikator</span>
            <span className="badge-pill !bg-white/15 !text-white !border-white/25">Real-time</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Selamat datang kembali</h2>
          <p className="text-sm text-slate-500 mb-8">Masuk untuk melanjutkan ke sistem pelaporan kinerja.</p>

          <form onSubmit={handleLogin} className="space-y-4">
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
            <button type="submit" disabled={loading} className="btn-pill-solid w-full justify-center py-3.5">
              {loading ? 'Memproses…' : 'Masuk'}
              {!loading && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Akun didaftarkan oleh administrator · © {new Date().getFullYear()} Kanim TBK
          </p>
        </div>
      </div>
    </div>
  )
}