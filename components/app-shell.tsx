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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-20 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between gap-4 px-8 h-24">
          <img src="/logo-simponik.png" alt="SIMPONIK" className="h-14 w-auto" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">{nama}</p>
              <p className="text-xs text-slate-500">{ROLE_LABEL[role]}</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <nav className="flex justify-center gap-8 px-8 pb-0">
          {links.map((l) => {
            const isActive = l.href === active
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  'relative whitespace-nowrap pb-4 text-sm transition ' +
                  (isActive ? 'font-semibold text-blue-700' : 'font-medium text-slate-400 hover:text-slate-700')
                }
              >
                {l.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-amber-400" />
                )}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="flex-1 p-8">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}