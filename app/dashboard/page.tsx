import Link from 'next/link'
import AppShell from '@/components/app-shell'
import { requireProfile } from '@/lib/get-profile'
import PeriodeFilter from './periode-filter'

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function StatTile({ label, value, sub, accent, barColor, icon }: { label: string; value: string; sub?: string; accent: string; barColor: string; icon: React.ReactNode }) {
  return (
    <div className="card-modern card-accent-top p-6" style={{ ['--accent-color' as string]: barColor }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
          <p className={'text-4xl font-extrabold mt-2 tabular-nums ' + accent}>{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
    </div>
  )
}

const IconChart = <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 13l3-3 3 3 4-6M4 19h16" /></svg>
const IconCheck = <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
const IconAlert = <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
const IconList = <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string }>
}) {
  const { supabase, nama, role, seksiId, seksiNama } = await requireProfile()

  const sp = await searchParams
  const periodeBulan = /^\d{4}-\d{2}$/.test(sp.periode || '') ? sp.periode! : currentMonth()
  const periodeDate = `${periodeBulan}-01`
  const [yy, mm] = periodeBulan.split('-')
  const bulanLabel = `${BULAN[Number(mm) - 1]} ${yy}`

  const { data: seksiList } = await supabase.from('seksi').select('id, nama').order('id')
  const { data: indikator } = await supabase
    .from('indikator_kinerja').select('id, seksi_id, target_tahunan')
  const { data: laporan } = await supabase
    .from('laporan_kinerja').select('indikator_id, realisasi')
    .gte('periode', `${yy}-01-01`).lte('periode', periodeDate)

  const indPct = (indikator ?? []).map((i) => {
    const cumulative = (laporan ?? [])
      .filter((l) => l.indikator_id === i.id)
      .reduce((a, l) => a + Number(l.realisasi), 0)
    const target = Number(i.target_tahunan)
    return { seksi_id: i.seksi_id, pct: target > 0 ? (cumulative / target) * 100 : 0 }
  })

  const totalIndikator = indPct.length
  const tercapai = indPct.filter((x) => x.pct >= 100).length
  const perluPerhatian = indPct.filter((x) => x.pct < 50).length
  const rataKantor = totalIndikator ? Math.round(indPct.reduce((a, x) => a + x.pct, 0) / totalIndikator) : 0

  const perSeksi = (seksiList ?? []).map((s) => {
    const items = indPct.filter((x) => x.seksi_id === s.id)
    const avg = items.length ? Math.round(items.reduce((a, x) => a + x.pct, 0) / items.length) : 0
    return { ...s, avg }
  })

  const barColor = (p: number) => (p >= 100 ? 'bg-emerald-500' : p >= 50 ? 'bg-blue-500' : 'bg-amber-500')

  return (
    <AppShell nama={nama} role={role} active="/dashboard" title="Dashboard">
      <div className="w-full space-y-6">
        <div
          className="relative overflow-hidden rounded-[1.75rem] p-8 text-white flex flex-wrap items-center justify-between gap-6"
          style={{ background: 'linear-gradient(120deg, #1e3a6b 0%, #142647 100%)' }}
        >
          <div className="blob w-72 h-72 bg-amber-400/20 -top-16 -right-10" />
          <div className="relative z-10">
            <p className="text-blue-100 text-sm">Selamat datang,</p>
            <p className="text-3xl font-extrabold mt-1">{nama}</p>
            <div className="badge-row mt-4">
              <span className="badge-pill !bg-white/10 !text-white !border-white/20">
                {role === 'admin' ? 'Administrator' : role === 'monitor' ? 'Kepala Kantor' : 'Pegawai'}
              </span>
              {seksiNama && <span className="badge-pill !bg-white/10 !text-white !border-white/20">{seksiNama}</span>}
            </div>
          </div>
          <div className="relative z-10 bg-white/10 rounded-2xl p-4">
            <label className="block text-xs font-medium text-blue-100 mb-1">Periode s.d. bulan</label>
            <PeriodeFilter periode={periodeBulan} />
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatTile label="Rata-rata kantor" value={`${rataKantor}%`} accent="text-blue-600" barColor="#1e3a6b" icon={IconChart} />
          <StatTile label="Indikator tercapai" value={`${tercapai}`} sub={`dari ${totalIndikator}`} accent="text-emerald-600" barColor="#059669" icon={IconCheck} />
          <StatTile label="Perlu perhatian" value={`${perluPerhatian}`} sub="capaian < 50%" accent="text-amber-600" barColor="#f4b62a" icon={IconAlert} />
          <StatTile label="Total indikator" value={`${totalIndikator}`} accent="text-slate-700" barColor="#64748b" icon={IconList} />
        </div>

        <section className="card-modern overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Capaian per seksi</h2>
            <span className="text-xs text-slate-400">s.d. {bulanLabel}</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {perSeksi.map((s) => (
              <li key={s.id} className="px-8 py-5">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{s.nama}</span>
                    {s.id === seksiId && <span className="badge-pill">Seksi kamu</span>}
                  </div>
                  <span className="text-base font-bold text-slate-700 tabular-nums">{s.avg}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={'h-full ' + barColor(s.avg)} style={{ width: `${Math.min(s.avg, 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/60">
            <Link href="/monitoring" className="text-sm font-bold text-blue-600 hover:text-blue-700">Lihat detail di Monitoring &rarr;</Link>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
