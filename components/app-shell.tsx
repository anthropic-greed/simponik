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
      <aside className="hidden md:flex w-64 flex-col text-white shrink-0" style={{ backgroundColor: '#101d38' }}>
        <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10">
          <img src="/logo-simponik.png" alt="SIMPONIK" className="h-8 w-auto bg-white rounded-lg px-2 py-1" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => {
            const isActive = l.href === active
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ' +
                  (isActive ? 'bg-blue-600 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white')
                }
              >
                <NavIcon name={l.icon} className="w-4.5 h-4.5 shrink-0" />
                {l.label}
              </Link>
            )
          })}
        </nav>
        <div className="m-3 rounded-2xl p-4" style={{ backgroundColor: '#16234f' }}>
          <p className="text-sm font-semibold">Kelola Kinerja,</p>
          <p className="text-sm font-semibold mb-2">Capai Tujuan Bersama</p>
          <p className="text-xs text-white/60 leading-relaxed">
            SIMPONIK membantu memantau dan melaporkan kinerja seksi secara terintegrasi.
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between bg-white border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <NavIcon name="home" className="w-4 h-4 text-slate-400" />
            <h1 className="text-base font-semibold text-slate-900">{title}</h1>
          </div>
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