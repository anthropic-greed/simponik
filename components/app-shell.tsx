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

const NAVY = '#1b3168'
const GOLD = '#f4b62a'

export default function AppShell({
  nama, role, active, title, children,
}: {
  nama: string; role: Role; active: string; title: string; children: React.ReactNode
}) {
  const links = NAV.filter((l) => l.roles.includes(role))

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="sticky top-0 z-20 text-white" style={{ backgroundColor: NAVY }}>
        {/* Baris 1: tinggi bar DIKUNCI ke h-28 (lebih tinggi dari sebelumnya) */}
        <div className="flex items-center justify-between gap-4 px-6 h-28">
          <img src="/logo-simponik-putih.png" alt="SIMPONIK" className="h-75 w-auto" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-tight">{nama}</p>
              <p className="text-xs text-white/60">{ROLE_LABEL[role]}</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Baris 2: menu horizontal */}
        <nav className="flex gap-1 overflow-x-auto px-4 border-t border-white/10">
          {links.map((l) => {
            const isActive = l.href === active
            return (
              <Link
                key={l.href}
                href={l.href}
                className={'whitespace-nowrap px-4 py-3 text-sm transition border-b-2 ' +
                  (isActive
                    ? 'font-semibold text-white'
                    : 'font-medium text-white/70 border-transparent hover:text-white hover:bg-white/5')}
                style={isActive ? { borderBottomColor: GOLD } : undefined}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="flex-1 p-6">
        <div className="w-full">
          <h1 className="text-xl font-bold text-slate-900 mb-5">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}