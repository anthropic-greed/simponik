'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email atau password salah.'); setLoading(false); return }
    router.push('/dashboard'); router.refresh()
  }

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        <div className="relative lg:w-1/2 min-h-[240px] lg:min-h-full overflow-hidden p-3">
          <div
            className="relative w-full h-full rounded-[1.5rem] overflow-hidden flex flex-col justify-end p-8"
            style={{ background: 'linear-gradient(160deg, #1e3a6b 0%, #325394 45%, #f4b62a 130%)' }}
          >
            <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(50,83,148,0.9), transparent 60%), radial-gradient(circle at 80% 90%, rgba(244,182,42,0.5), transparent 55%)' }} />
            <div className="relative z-10 text-white">
              <p className="text-white/70 text-sm mb-1">Anda dapat dengan mudah</p>
              <p className="text-2xl sm:text-3xl font-extrabold leading-snug">
                Memantau capaian kinerja seluruh seksi dalam satu tempat
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 py-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Masuk ke SIMPONIK</h2>
          <p className="text-sm text-slate-500 mt-2 mb-8">
            Akses laporan kinerja seksi Anda kapan saja, di mana saja.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Email Anda</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className={inputCls} placeholder="nama@imigrasi.go.id" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  className={inputCls + ' pr-11'} placeholder="••••••••" />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7 1-3 5-7 10-7s9 4 10 7a10.05 10.05 0 01-1.125 2.175M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold py-3.5 text-sm transition shadow-lg shadow-blue-700/30">
              {loading ? 'Memproses…' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun? <span className="text-blue-700 font-semibold">Hubungi administrator</span>
          </p>
        </div>
      </div>
    </div>
  )
}