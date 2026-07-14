import Link from 'next/link'
import LogoutButton from './logout-button'

type Role = 'admin' | 'pegawai' | 'monitor'

const NAV: { href: string; label: string; roles: Role[] }[] = [
  { href: '/dashboard', label: 'Dashboard', roles: ['admin', 'pegawai', 'monitor'] },
  { href: '/laporan', label: 'Laporan Kinerja', roles: ['admin', 'pegawai'] },
  { href: '/monitoring', label: 'Monitoring', roles: ['admin', 'monitor', 'pegawai'] },
  { href: '/admin/akun', label: 'Kelola Akun', roles: ['admin'] },
]

const ROLE_LABEL: Record<Role, string> = {
  admin: 'Administrator',
  pegawai: 'Pegawai',
  monitor: 'Kepala Kantor',
}

export default function AppShell({
  nama, role, active, title, children,
}: {
  nama: string; role: Role; active: string; title: string; children: React.ReactNode
}) {
  const links = NAV.filter((l) => l.roles.includes(role))

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="sticky top-0 z-20 relative overflow-hidden bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative flex items-center justify-between gap-4 px-6 h-24">
          <img src="/logo-simponik.png" alt="SIMPONIK" className="h-16 w-auto" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">{nama}</p>
              <p className="text-xs text-slate-500">{ROLE_LABEL[role]}</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <nav className="relative flex gap-1 overflow-x-auto px-4 border-t border-slate-100">
          {links.map((l) => {
            const isActive = l.href === active
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  'relative whitespace-nowrap px-4 py-3 text-sm transition rounded-t-lg ' +
                  (isActive ? 'font-semibold text-blue-700 bg-blue-50' : 'font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50')
                }
              >
                {l.label}
                {isActive && (
                  <span className="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(244,182,42,0.7)]" />
                )}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="flex-1 p-6">
        <div className="w-full">
          <h1 className="text-xl font-bold text-slate-900 mb-5 tracking-tight">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
