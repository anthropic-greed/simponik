'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError('Email atau kata sandi salah.')
    else router.push('/dashboard')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="relative z-10 w-full max-w-sm mx-4 rounded-2xl px-8 py-10"
        style={{
          background: 'rgba(15, 25, 50, 0.65)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo-simponik-mark.png"
            alt="SIMPONIK"
            style={{ filter: 'brightness(0) invert(1)', height: '36px', width: 'auto', marginBottom: '16px' }}
          />
          <h1 className="text-white text-xl font-bold tracking-wide">Masuk ke SIMPONIK</h1>
          <p className="text-white/45 text-xs mt-1">Sistem Monitoring & Pelaporan Kinerja</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              onFocus={e => e.currentTarget.style.border = '1px solid rgba(96,165,250,0.7)'}
              onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)'}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Kata sandi"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              onFocus={e => e.currentTarget.style.border = '1px solid rgba(96,165,250,0.7)'}
              onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)'}
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-bold text-white transition disabled:opacity-60 mt-2"
            style={{
              background: loading ? 'rgba(37,99,235,0.6)' : 'linear-gradient(90deg, #1d4ed8, #2563eb)',
              boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
            }}
          >
            {loading ? 'Memuat…' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          &copy; {new Date().getFullYear()} SIMPONIK — KPP Pratama
        </p>
      </div>
    </div>
  )
}
