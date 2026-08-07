import Link from 'next/link'
import AppShell from '@/components/app-shell'
import { requireProfile } from '@/lib/get-profile'
import { hitungCapaian } from '@/lib/kinerja'
import PeriodeFilter from './periode-filter'

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const SEKSI_OTOMATIS = ['TU', 'TIKKIM']

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function SeksiIcon({ kode }: { kode: string }) {
  const common = { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 } as const
  if (kode === 'TU') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h5l2 3h11v9H3V7z" /></svg>
  if (kode === 'TIKKIM') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7a2 2 0 012-2h6a2 2 0 012 2v10M5 21h14M9 21v-4M15 21v-4" /></svg>
  if (kode === 'INTELDAKIM') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" /></svg>
  return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zm3 4a2 2 0 100 4 2 2 0 000-4zm0 0v6m6-4h4m-4 4h4" /></svg>
}

function CircularProgress({ pct }: { pct: number }) {
  const r = 42
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(pct, 100) / 100) * c
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
      <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
      <circle
        cx="48" cy="48" r={r} fill="none" stroke="#f4b62a" strokeWidth="8"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 48 48)"
      />
    </svg>
  )
}

function StatTile({ label, value, sub, accent, icon }: { label: string; value: string; sub?: string; accent: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className={'text-3xl font-bold mt-1.5 tabular-nums ' + accent}>{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
    </div>
  )
}

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

  const { data: seksiList } = await supabase.from('seksi').select('id, nama, kode').order('id')
  const { data: indikator } = await supabase
    .from('indikator_kinerja').select('id, seksi_id, target_tahunan')
  const { data: laporan } = await supabase
    .from('laporan_kinerja').select('indikator_id, periode, realisasi')
    .gte('periode', `${yy}-01-01`).lte('periode', periodeDate)

  const indPct = (indikator ?? []).map((i) => {
    const seksiKode = (seksiList ?? []).find((s) => s.id === i.seksi_id)?.kode ?? ''
    const otomatisAktif = SEKSI_OTOMATIS.includes(seksiKode)
    const milik = (laporan ?? []).filter((l) => l.indikator_id === i.id)
    const target = Number(i.target_tahunan)
    const { pct } = hitungCapaian(target, milik, periodeBulan, otomatisAktif)
    return { seksi_id: i.seksi_id, pct }
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
        {/* Banner sambutan dengan foto kantor */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Selamat datang, {nama}! 👋</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                Berikut ringkasan capaian kinerja Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <label className="block text-xs font-medium text-slate-500 mb-1">Periode</label>
              <PeriodeFilter periode={periodeBulan} />
            </div>
          </div>
          <img
            src="/kantor.jpg"
            alt=""
            className="hidden lg:block absolute top-0 right-0 h-full w-80 object-cover opacity-20"
            style={{ maskImage: 'linear-gradient(to left, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent 100%)' }}
          />
        </div>

        {/* Kartu statistik */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl p-5 text-white flex items-center justify-between" style={{ backgroundColor: '#16234f' }}>
            <div>
              <p className="text-xs font-medium text-white/70">Rata-rata Capaian Kantor</p>
              <p className="text-4xl font-extrabold mt-1.5">{rataKantor}%</p>
              <p className="text-xs text-white/50 mt-1">dari target keseluruhan</p>
            </div>
            <CircularProgress pct={rataKantor} />
          </div>
          <StatTile label="Indikator Tercapai" value={`${tercapai}`} sub={`dari ${totalIndikator} indikator`} accent="text-emerald-600" icon={IconCheck} />
          <StatTile label="Perlu Perhatian" value={`${perluPerhatian}`} sub="capaian < 50%" accent="text-amber-600" icon={IconAlert} />
          <StatTile label="Total Indikator" value={`${totalIndikator}`} sub="indikator aktif" accent="text-slate-700" icon={IconList} />
        </div>

        {/* Capaian per seksi */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Capaian per Seksi</h2>
            <span className="text-xs text-slate-400">s.d. {bulanLabel}</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {perSeksi.map((s) => (
              <li key={s.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <SeksiIcon kode={s.kode} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-slate-800 truncate">{s.nama}</span>
                      {s.id === seksiId && (
                        <span className="inline-flex rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[11px] font-medium border border-blue-100 shrink-0">Seksi kamu</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 tabular-nums shrink-0">{s.avg}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={'h-full ' + barColor(s.avg)} style={{ width: `${Math.min(s.avg, 100)}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/60">
            <Link href="/monitoring" className="text-sm font-medium text-blue-600 hover:text-blue-700">Lihat detail di Monitoring &rarr;</Link>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
