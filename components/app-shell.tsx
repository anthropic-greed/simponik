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

const FEATURES = ['Transparan', 'Real-time', 'Akuntabel', 'Terukur', 'Berbasis Data']

export default function AppShell({
  nama, role, active, title, children,
}: {
  nama: string; role: Role; active: string; title: string; children: React.ReactNode
}) {
  const links = NAV.filter((l) => l.roles.includes(role))

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex items-center justify-between gap-4 px-8 h-24 border-b border-slate-100">
          <img src="/logo-simponik.png" alt="SIMPONIK" className="h-14 w-auto" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">{nama}</p>
              <p className="text-xs text-slate-500">{ROLE_LABEL[role]}</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="feature-strip overflow-hidden">
          <div className="flex items-center gap-8 px-8 py-2 overflow-x-auto">
            {FEATURES.map((f) => (
              <span key={f} className="feature-strip-item">
                <svg className="w-3.5 h-3.5 text-amber-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.2 5.6L18 9l-4.5 3.9L15 19l-5-3.3L5 19l1.5-6.1L2 9l5.8-1.4z"/></svg>
                {f}
              </span>
            ))}
          </div>
        </div>

        <nav className="flex justify-center gap-8 px-8 border-b border-slate-100">
          {links.map((l) => {
            const isActive = l.href === active
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  'relative whitespace-nowrap py-4 text-sm transition ' +
                  (isActive ? 'font-bold text-blue-700' : 'font-medium text-slate-400 hover:text-slate-700')
                }
              >
                {l.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-amber-400" />
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
