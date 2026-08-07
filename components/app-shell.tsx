'use client'
import Link from 'next/link'
import LogoutButton from './logout-button'

type Role = 'admin' | 'pegawai' | 'monitor'

const NAV: { href: string; label: string; roles: Role[]; icon: string }[] = [
  { href: '/dashboard', label: 'Dashboard', roles: ['admin', 'pegawai', 'monitor'], icon: 'home' },
  { href: '/laporan', label: 'Laporan Kinerja', roles: ['admin', 'pegawai'], icon: 'doc' },
  { href: '/monitoring', label: 'Monitoring', roles: ['admin', 'monitor', 'pegawai'], icon: 'chart' },
  { href: '/admin/akun', label: 'Kelola Akun', roles: ['admin'], icon: 'users' },
]

const ROLE_LABEL: Record<Role, string> = {
  admin: 'Administrator',
  pegawai: 'Pegawai',
  monitor: 'Kepala Kantor',
}

function NavIcon({ name, className }: { name: string; className?: string }) {
  const common = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 } as const
  if (name === 'home') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h14V10" /></svg>
  if (name === 'doc') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h1M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
  if (name === 'chart') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M7 13l3-3 3 3 4-6M4 19h16" /></svg>
  return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-3.13a4 4 0 100-8 4 4 0 000 8zm6 3a4 4 0 00-3-3.87" /></svg>
}

export default function AppShell({
  nama, role, active, title, children,
}: {
  nama: string; role: Role; active: string; title: string; children: React.ReactNode
}) {
  const links = NAV.filter((l) => l.roles.includes(role))
  const inisial = nama.trim().charAt(0).toUpperCase() || '?'

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside
        className="hidden md:flex w-64 flex-col text-white shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0f1f4a 50%, #0d2060 100%)' }}
      >
        {/* Pola titik halus */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />

        {/* Glow biru di kanan bawah */}
        <div className="pointer-events-none absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

        {/* Logo area */}
        <div className="relative px-6 pt-7 pb-2 flex flex-col items-start">
          <img
            src="/logo-simponik-mark.png"
            alt="SIMPONIK"
            style={{ filter: 'brightness(0) invert(1)', height: '36px', width: 'auto', maxWidth: '160px', objectFit: 'contain' }}
          />
          <p className="text-[10px] font-medium tracking-widest text-white/40 mt-1.5 uppercase">
            Sistem Monitoring &<br />Pelaporan Kinerja
          </p>
        </div>

        {/* Divider */}
        <div className="relative mx-4 mb-3 h-px bg-white/10" />

        {/* Nav */}
        <nav className="relative px-3 space-y-1">
          {links.map((l) => {
            const isActive = l.href === active
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ' +
                  (isActive
                    ? 'text-white shadow-lg'
                    : 'text-white/55 hover:text-white hover:bg-white/5')
                }
                style={isActive ? { background: 'linear-gradient(90deg, #2563eb, #1d4ed8)', boxShadow: '0 6px 20px -4px rgba(37,99,235,0.55)' } : undefined}
              >
                <span className={'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ' + (isActive ? 'bg-white/15' : 'bg-white/8')}>
                  <NavIcon name={l.icon} className="w-4 h-4" />
                </span>
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Ornamen tengah: lingkaran orbit + ikon chart */}
        <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden">
          <svg viewBox="0 0 180 200" className="w-full max-w-[180px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Lingkaran konsentris */}
            <circle cx="90" cy="100" r="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <circle cx="90" cy="100" r="58" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="5 4" />
            <circle cx="90" cy="100" r="40" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
            <circle cx="90" cy="100" r="22" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
            {/* Garis grid */}
            <line x1="30" y1="38" x2="150" y2="162" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="150" y1="38" x2="30" y2="162" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="90" y1="25" x2="90" y2="175" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="15" y1="100" x2="165" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            {/* Titik orbit biru */}
            <circle cx="90" cy="25" r="3" fill="rgba(96,165,250,0.8)" />
            <circle cx="165" cy="100" r="2.5" fill="rgba(96,165,250,0.5)" />
            <circle cx="90" cy="175" r="2" fill="rgba(96,165,250,0.4)" />
            <circle cx="15" cy="100" r="2" fill="rgba(96,165,250,0.4)" />
            {/* Titik dekorasi kecil */}
            <circle cx="48" cy="48" r="1.5" fill="rgba(255,255,255,0.25)" />
            <circle cx="132" cy="48" r="1" fill="rgba(255,255,255,0.2)" />
            <circle cx="145" cy="138" r="1.5" fill="rgba(255,255,255,0.2)" />
            <circle cx="35" cy="142" r="1" fill="rgba(255,255,255,0.2)" />
            <circle cx="60" cy="158" r="1" fill="rgba(96,165,250,0.45)" />
            <circle cx="120" cy="158" r="1.5" fill="rgba(96,165,250,0.35)" />
            {/* Kotak ikon chart di tengah */}
            <rect x="72" y="82" width="36" height="36" rx="9" fill="rgba(29,78,216,0.35)" stroke="rgba(96,165,250,0.5)" strokeWidth="1" />
            {/* Ikon trend chart */}
            <polyline points="79,109 85,99 93,104 103,93" stroke="rgba(96,165,250,1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="103" cy="93" r="2.2" fill="rgba(96,165,250,1)" />
            {/* Cahaya bawah */}
            <ellipse cx="90" cy="185" rx="45" ry="7" fill="rgba(37,99,235,0.18)" />
          </svg>
        </div>

        {/* Kartu bawah */}
        <div className="relative mx-3 mb-3 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <div className="p-4">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M4 18h16M6 18v-7m4 7v-7m4 7v-7m4 7v-7M4 11l8-6 8 6" />
              </svg>
            </div>
            <p className="text-sm font-bold leading-snug text-white">Kelola Kinerja,<br />Capai Tujuan Bersama</p>
            <p className="text-[11px] text-white/45 mt-1.5 leading-relaxed">
              SIMPONIK membantu memantau, mengumpulkan, dan melaporkan kinerja secara terintegrasi.
            </p>
          </div>
          {/* Garis cahaya bawah */}
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, transparent 0%, #60a5fa 50%, transparent 100%)' }} />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between bg-white border-b border-slate-100 px-6 py-4">
          <h1 className="text-base font-semibold text-slate-900">{title}</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
              {inisial}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-800 leading-tight">{nama}</p>
              <p className="text-xs text-slate-500">{ROLE_LABEL[role]}</p>
            </div>
            <LogoutButton />
          </div>
        </header>

        <nav className="md:hidden flex gap-1 overflow-x-auto bg-white border-b border-slate-100 px-3 py-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                'whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ' +
                (l.href === active ? 'bg-blue-600 text-white' : 'text-slate-600 bg-slate-100')
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
