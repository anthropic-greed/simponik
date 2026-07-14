import Link from 'next/link'
import LogoutButtonClient from './logout-button'

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
        <div className="flex items-center justify-between gap-6 px-8 h-20">
          <div className="flex items-center gap-10">
            <img src="/logo-simponik.png" alt="SIMPONIK" className="h-50 w-auto shrink-0" />
            <nav className="hidden md:flex items-center gap-7">
              {links.map((l) => {
                const isActive = l.href === active
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={
                      'text-sm whitespace-nowrap transition ' +
                      (isActive ? 'font-bold text-slate-900' : 'font-medium text-slate-500 hover:text-slate-800')
                    }
                  >
                    {l.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">{nama}</p>
              <p className="text-xs text-slate-500">{ROLE_LABEL[role]}</p>
            </div>
            <LogoutButtonClient />
          </div>
        </div>

        <nav className="md:hidden flex gap-1 overflow-x-auto px-4 pb-2 border-t border-slate-100">
          {links.map((l) => {
            const isActive = l.href === active
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  'whitespace-nowrap px-3 py-1.5 mt-2 rounded-full text-sm ' +
                  (isActive ? 'font-bold bg-slate-900 text-white' : 'font-medium text-slate-500 bg-slate-100')
                }
              >
                {l.label}
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