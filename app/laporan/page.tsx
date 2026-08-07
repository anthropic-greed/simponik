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

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Panel kiri: form */}
      <div className="w-full lg:w-[45%] bg-white flex flex-col justify-center px-8 sm:px-16 py-12 min-h-[50vh] lg:min-h-screen">
        <img src="/logo-simponik.png" alt="SIMPONIK" className="h-9 w-auto mb-10" />

        <h1 className="text-2xl font-bold text-slate-900">Masuk</h1>
        <p className="text-sm text-slate-500 mt-1 mb-8">
          Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun
        </p>

        <form onSubmit={handleLogin} className="space-y-4 max-w-sm">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="Email"
              className="w-full rounded-full bg-slate-100 border border-slate-200 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="Password"
              className="w-full rounded-full bg-slate-100 border border-slate-200 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="rounded-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold px-8 py-3 text-sm tracking-wide transition shadow-lg shadow-blue-700/30"
          >
            {loading ? 'MEMPROSES…' : 'MASUK'}
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-8">
          Akun didaftarkan oleh administrator.
        </p>
      </div>

      {/* Panel kanan: foto kantor */}
      <div className="relative w-full lg:w-[55%] min-h-[35vh] lg:min-h-screen overflow-hidden">
        <img
          src="/kantor.jpg"
          alt="Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(15,25,50,0.05) 0%, rgba(15,25,50,0.65) 100%)' }}
        />
        <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 text-right text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">SIMPONIK</h2>
          <p className="text-sm sm:text-base font-medium text-white/85 mt-2 tracking-wide">
            SISTEM INFORMASI PELAPORAN KINERJA
          </p>
        </div>
      </div>
    </div>
  )
}