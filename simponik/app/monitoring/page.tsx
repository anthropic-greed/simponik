import AppShell from '@/components/app-shell'
import { requireProfile } from '@/lib/get-profile'
import MonitoringFilter from './monitoring-filter'

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const fmt = (n: number) => n.toLocaleString('id-ID')

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function warna(pct: number) {
  if (pct >= 100) return { bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
  if (pct >= 50) return { bar: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-100' }
  return { bar: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-100' }
}

export default async function MonitoringPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string }>
}) {
  const { supabase, nama, role } = await requireProfile() 

  const sp = await searchParams
  const periodeBulan = /^\d{4}-\d{2}$/.test(sp.periode || '') ? sp.periode! : currentMonth()
  const periodeDate = `${periodeBulan}-01`
  const [yy, mm] = periodeBulan.split('-')
  const bulanLabel = `${BULAN[Number(mm) - 1]} ${yy}`

  const { data: seksiList } = await supabase.from('seksi').select('id, nama').order('id')
  const { data: indikator } = await supabase
    .from('indikator_kinerja')
    .select('id, seksi_id, kode, nama, satuan, target_tahunan')
    .order('kode')
  const { data: laporan } = await supabase
    .from('laporan_kinerja')
    .select('indikator_id, periode, realisasi')
    .gte('periode', `${yy}-01-01`)
    .lte('periode', periodeDate)

  const grouped = (seksiList ?? []).map((s) => {
    const items = (indikator ?? [])
      .filter((i) => i.seksi_id === s.id)
      .map((i) => {
        const cumulative = (laporan ?? [])
          .filter((l) => l.indikator_id === i.id)
          .reduce((a, l) => a + Number(l.realisasi), 0)
        const target = Number(i.target_tahunan)
        const pct = target > 0 ? Math.round((cumulative / target) * 100) : 0
        return { id: i.id, kode: i.kode, nama: i.nama, satuan: i.satuan, target, cumulative, pct }
      })
    const avg = items.length ? Math.round(items.reduce((a, it) => a + it.pct, 0) / items.length) : 0
    return { seksi: s, items, avg }
  })

  return (
    <AppShell nama={nama} role={role} active="/monitoring" title="Monitoring">
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Rekap capaian seluruh seksi</h2>
            <p className="text-sm text-slate-500">Periode s.d. {bulanLabel}</p>
          </div>
          <MonitoringFilter periode={periodeBulan} />
        </div>

        {grouped.map(({ seksi, items, avg }) => {
          const w = warna(avg)
          return (
            <section key={seksi.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-900">{seksi.nama}</h3>
                <span className={'inline-flex rounded-full px-3 py-1 text-xs font-medium border ' + w.badge}>
                  Rata-rata {avg}%
                </span>
              </div>

              {items.length === 0 ? (
                <p className="px-6 py-5 text-sm text-slate-400">Belum ada indikator.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="text-left font-medium px-6 py-3 min-w-[240px]">Indikator</th>
                        <th className="text-right font-medium px-4 py-3">Target setahun</th>
                        <th className="text-right font-medium px-4 py-3">Total s.d. bulan</th>
                        <th className="text-left font-medium px-4 py-3 min-w-[180px]">Capaian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((it) => {
                        const c = warna(it.pct)
                        return (
                          <tr key={it.id}>
                            <td className="px-6 py-3">
                              <p className="font-medium text-slate-800">{it.nama}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{it.kode}</p>
                            </td>
                            <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap tabular-nums">
                              {fmt(it.target)} <span className="text-slate-400">{it.satuan}</span>
                            </td>
                            <td className="px-4 py-3 text-right text-slate-700 whitespace-nowrap tabular-nums">{fmt(it.cumulative)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                  <div className={'h-full ' + c.bar} style={{ width: `${Math.min(it.pct, 100)}%` }} />
                                </div>
                                <span className="text-xs font-medium text-slate-600 w-10 text-right tabular-nums">{it.pct}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </AppShell>
  )
}