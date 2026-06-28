import { redirect } from 'next/navigation'
import AppShell from '@/components/app-shell'
import { requireProfile } from '@/lib/get-profile'
import FormTambahAkun from './form-tambah-akun'

const ROLE_BADGE: Record<string, string> = {
  admin: 'bg-blue-50 text-blue-700 border-blue-100',
  pegawai: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  monitor: 'bg-amber-50 text-amber-700 border-amber-100',
}

export default async function KelolaAkunPage() {
  const { supabase, nama, role } = await requireProfile()
  if (role !== 'admin') redirect('/dashboard')

  const { data: seksiList } = await supabase.from('seksi').select('id, nama').order('id')
  const { data: akunList } = await supabase
    .from('profiles').select('nama_lengkap, role, seksi ( nama )').order('created_at')

  return (
    <AppShell nama={nama} role={role} active="/admin/akun" title="Kelola Akun">
      <div className="w-full space-y-6">
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Tambah akun baru</h2>
          <FormTambahAkun seksiList={seksiList ?? []} />
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-semibold text-slate-900">Daftar akun</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left font-medium px-6 py-3">Nama</th>
                <th className="text-left font-medium px-6 py-3">Role</th>
                <th className="text-left font-medium px-6 py-3">Seksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {akunList?.map((a, i) => {
                const s = Array.isArray(a.seksi) ? a.seksi[0]?.nama : (a.seksi as { nama?: string } | null)?.nama
                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-800">{a.nama_lengkap || '—'}</td>
                    <td className="px-6 py-3">
                      <span className={'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ' + (ROLE_BADGE[a.role] || 'bg-slate-50 text-slate-600 border-slate-200')}>
                        {a.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{s || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  )
}