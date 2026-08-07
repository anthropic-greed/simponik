import { redirect } from 'next/navigation'
import AppShell from '@/components/app-shell'
import { requireProfile } from '@/lib/get-profile'
import { hitungCapaian } from '@/lib/kinerja'
import LaporanFilter from './laporan-filter'
import LaporanMasterDetail from './laporan-master-detail'
import LaporanPdfButton from './laporan-pdf-button'

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const SEKSI_OTOMATIS = ['TU', 'TIKKIM']

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string; seksi?: string }>
}) {
  const { supabase, nama, role, seksiId: mySeksiId, seksiNama } = await requireProfile()
  if (role === 'monitor') redirect('/monitoring')

  const sp = await searchParams
  const periodeBulan = /^\d{4}-\d{2}$/.test(sp.periode || '') ? sp.periode! : currentMonth()
  const periodeDate = `${periodeBulan}-01`
  const [yy, mm] = periodeBulan.split('-')
  const bulanLabel = `${BULAN[Number(mm) - 1]} ${yy}`

  let seksiList: { id: number; nama: string }[] | null = null
  let seksiAktif: number | null = mySeksiId
  let seksiNamaAktif = seksiNama
  let seksiKodeAktif = ''

  const { data: seksiFull } = await supabase.from('seksi').select('id, nama, kode').order('id')

  if (role === 'admin') {
    seksiList = (seksiFull ?? []).map((s) => ({ id: s.id, nama: s.nama }))
    seksiAktif = sp.seksi ? Number(sp.seksi) : (seksiList[0]?.id ?? null)
    seksiNamaAktif = seksiList.find((s) => s.id === seksiAktif)?.nama
  }
  seksiKodeAktif = (seksiFull ?? []).find((s) => s.id === seksiAktif)?.kode ?? ''
  const otomatisAktif = SEKSI_OTOMATIS.includes(seksiKodeAktif)

  if (!seksiAktif) {
    return (
      <AppShell nama={nama} role={role} active="/laporan" title="Laporan Kinerja">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-slate-500 max-w-2xl">
          Akunmu belum terhubung ke seksi mana pun. Hubungi administrator.
        </div>
      </AppShell>
    )
  }

  const { data: indikator } = await supabase
    .from('indikator_kinerja')
    .select('id, kode, nama, satuan, target_tahunan')
    .eq('seksi_id', seksiAktif)
    .order('kode')

  const ids = (indikator ?? []).map((i) => i.id)
  const { data: laporan } = ids.length
    ? await supabase
        .from('laporan_kinerja')
        .select('indikator_id, periode, realisasi')
        .in('indikator_id', ids)
        .gte('periode', `${yy}-01-01`)
        .lte('periode', periodeDate)
    : { data: [] as { indikator_id: number; periode: string; realisasi: number }[] }

  const rows = (indikator ?? []).map((i) => {
    const milik = (laporan ?? []).filter((l) => l.indikator_id === i.id)
    const current = milik.find((l) => l.periode === periodeDate)?.realisasi
    const target = Number(i.target_tahunan)
    const { cumulative, pct, isTahunan, needsInput } = hitungCapaian(target, milik, periodeBulan, otomatisAktif)
    return {
      indikatorId: i.id, kode: i.kode, nama: i.nama, satuan: i.satuan,
      target,
      current: current === undefined ? null : Number(current),
      cumulative,
      pct,
      isTahunan,
      needsInput,
    }
  })

  return (
    <AppShell nama={nama} role={role} active="/laporan" title="Laporan Kinerja">
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h5l2 3h11v9H3V7z" /></svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{seksiNamaAktif}</h2>
              <p className="text-sm text-slate-500">Capaian periode {bulanLabel}</p>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <LaporanFilter periode={periodeBulan} seksiAktif={seksiAktif} seksiList={seksiList} />
            <LaporanPdfButton seksiNama={seksiNamaAktif ?? ''} bulanLabel={bulanLabel} items={rows} />
          </div>
        </div>

        <LaporanMasterDetail periode={periodeBulan} bulanLabel={bulanLabel} seksiNama={seksiNamaAktif ?? ''} rows={rows} />
      </div>
    </AppShell>
  )
}