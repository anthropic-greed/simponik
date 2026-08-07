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
        style={{ background: 'linear-gradient(160deg, #101d38 0%, #1b2a5c 55%, #26356f 100%)' }}
      >
        {/* Pola titik halus */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />

        <div className="relative px-6 py-4 flex justify-center">
          <img src="/logo-simponik-mark.png" alt="SIMPONIK logo mark in corporate blue tones displayed in the sidebar of the dashboard" className="h-50 w-auto" />
        </div>

        <nav className="relative px-4 py-2 space-y-2">
          {links.map((l) => {
            const isActive = l.href === active
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ' +
                  (isActive
                    ? 'text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5')
                }
                style={isActive ? { background: 'linear-gradient(90deg, #2563eb, #1e40af)', boxShadow: '0 8px 20px -6px rgba(37,99,235,0.6)' } : undefined}
              >
                <span className={'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ' + (isActive ? 'bg-white/15' : 'bg-white/5')}>
                  <NavIcon name={l.icon} className="w-4 h-4" />
                </span>
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Ilustrasi garis bangunan dekoratif */}
        <div className="relative flex-1 flex items-end justify-center px-6 opacity-40">
          <svg viewBox="0 0 200 140" className="w-full max-w-[180px]" fill="none" stroke="white" strokeWidth="0.7">
            <rect x="20" y="60" width="160" height="70" />
            <line x1="20" y1="80" x2="180" y2="80" />
            <line x1="20" y1="100" x2="180" y2="100" />
            <line x1="20" y1="120" x2="180" y2="120" />
            <line x1="55" y1="60" x2="55" y2="130" />
            <line x1="90" y1="60" x2="90" y2="130" />
            <line x1="125" y1="60" x2="125" y2="130" />
            <line x1="160" y1="60" x2="160" y2="130" />
            <path d="M20 60 L100 20 L180 60" />
            <line x1="100" y1="20" x2="100" y2="60" />
          </svg>
        </div>

        {/* Kartu bawah */}
        <div className="relative m-3 mb-0 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="p-5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M4 18h16M6 18v-7m4 7v-7m4 7v-7m4 7v-7M4 11l8-6 8 6" />
              </svg>
            </div>
            <p className="text-sm font-bold leading-snug">Kelola Kinerja,<br />Capai Tujuan Bersama</p>
            <p className="text-xs text-white/50 mt-2 leading-relaxed">
              SIMPONIK membantu memantau, mengumpulkan, dan melaporkan kinerja secara terintegrasi.
            </p>
          </div>
          <div className="h-1" style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />
        </div>
        <div className="h-4" />
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

