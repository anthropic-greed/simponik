"use client"

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Panel kiri: foto + lengkung organik */}
      <div className="relative w-full lg:w-[52%] min-h-[35vh] lg:min-h-screen overflow-hidden">
        <img
          src="/kantor.jpg"
          alt="Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(15,25,50,0.10) 0%, rgba(15,25,50,0.55) 100%)' }}
        />

        {/* Lapisan SVG putih membentuk tepi organik, TIDAK memotong panel form */}
        <svg
          className="hidden lg:block absolute top-0 right-0 h-full w-24"
          viewBox="0 0 100 800"
          preserveAspectRatio="none"
        >
          <path
            d="M100,0
               C 60,40 90,90 55,140
               C 20,190 85,230 60,280
               C 35,330 95,370 65,420
               C 35,470 90,510 55,560
               C 20,610 85,650 60,700
               C 40,730 90,760 100,800
               L 100,0 Z"
            fill="white"
          />
        </svg>

        <div className="absolute top-10 left-8 sm:left-12 text-white z-10">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.3em]">SELAMAT DATANG</p>
        </div>
      </div>

      {/* Panel kanan: form, persegi biasa (tidak dipotong bentuk) */}
      <div className="relative w-full lg:w-[48%] flex flex-col justify-center px-8 sm:px-16 py-12 min-h-[65vh] lg:min-h-screen">
        <img src="/logo-simponik.png" alt="SIMPONIK" className="h-9 w-auto absolute top-8 right-8 sm:right-12" />

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Masuk</h1>
          <p className="text-sm text-slate-500 mb-10">
            Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun
          </p>

          <form onSubmit={handleLogin} className="space-y-7">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="nama@imigrasi.go.id"
                className="w-full border-0 border-b border-slate-300 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-blue-600 placeholder:text-slate-300"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
              </div>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full border-0 border-b border-slate-300 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-blue-600 placeholder:text-slate-300"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full rounded-full bg-blue-900 hover:bg-blue-950 disabled:opacity-60 text-white font-semibold py-3.5 text-sm transition shadow-lg shadow-blue-900/25"
            >
              {loading ? 'Memproses…' : 'Masuk'}
            </button>
          </form>

          <p className="text-sm text-slate-400 mt-10">
            Belum punya akun? <span className="text-blue-700 font-semibold">Hubungi administrator</span>
          </p>
        </div>
      </div>
    </div>
  )
}