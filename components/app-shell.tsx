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
      <header
        className="sticky top-0 z-20 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(120deg, #101d38 0%, #1b3168 55%, #26428c 100%)' }}
      >
        <div className="pointer-events-none absolute -top-28 -right-20 w-80 h-80 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-blue-300/15 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative flex items-center justify-between gap-4 px-6 h-28">
          <img src="/logo-simponik-putih.png" alt="SIMPONIK" className="h-20 w-auto" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-tight">{nama}</p>
              <p className="text-xs text-white/60">{ROLE_LABEL[role]}</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <nav className="relative flex gap-1 overflow-x-auto px-4 border-t border-white/10">
          {links.map((l) => {
            const isActive = l.href === active
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  'relative whitespace-nowrap px-4 py-3 text-sm transition rounded-t-lg ' +
                  (isActive ? 'font-semibold text-white bg-white/10' : 'font-medium text-white/70 hover:text-white hover:bg-white/5')
                }
              >
                {l.label}
                {isActive && (
                  <span className="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(244,182,42,0.9)]" />
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
