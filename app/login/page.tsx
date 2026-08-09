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
    'w-full rounded-xl border-0 bg-slate-100/90 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center px-4 py-10">
      <img
        src="/kantor.jpg"
        alt="Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden p-8"
        style={{ background: 'rgba(15,25,55,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="text-center mb-6">
          <img src="/logo-simponik-mark.png" alt="SIMPONIK" className="h-6 w-auto mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white">Masuk ke SIMPONIK</h1>
          <p className="text-sm text-white/60 mt-1">Sistem Monitoring &amp; Pelaporan Kinerja</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            placeholder="nama@imigrasi.go.id"
            className={inputCls}
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            placeholder="••••••••"
            className={inputCls}
          />

          {error && <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 text-sm transition"
          >
            {loading ? 'Memproses…' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-xs text-white/40 mt-6">
          © {new Date().getFullYear()} SIMPONIK — Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun
        </p>
      </div>
    </div>
  )
}
