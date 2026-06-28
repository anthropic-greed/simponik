import { redirect } from 'next/navigation'
import AppShell from '@/components/app-shell'
import { requireProfile } from '@/lib/get-profile'
import LaporanFilter from './laporan-filter'
import LaporanForm from './laporan-form'

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

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

  // Tentukan seksi yang ditampilkan
  let seksiList: { id: number; nama: string }[] | null = null
  let seksiAktif: number | null = mySeksiId
  let seksiNamaAktif = seksiNama
  if (role === 'admin') {
    const { data } = await supabase.from('seksi').select('id, nama').order('id')
    seksiList = data ?? []
    seksiAktif = sp.seksi ? Number(sp.seksi) : (seksiList[0]?.id ?? null)
    seksiNamaAktif = seksiList.find((s) => s.id === seksiAktif)?.nama
  }

  if (!seksiAktif) {
    return (
      <AppShell nama={nama} role={role} active="/laporan" title="Laporan Kinerja">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-slate-500 max-w-2xl">
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
    const cumulative = milik.reduce((s, l) => s + Number(l.realisasi), 0)
    return {
      indikatorId: i.id, kode: i.kode, nama: i.nama, satuan: i.satuan,
      target: Number(i.target_tahunan),
      current: current === undefined ? null : Number(current),
      cumulative,
    }
  })

  return (
    <AppShell nama={nama} role={role} active="/laporan" title="Laporan Kinerja">
      <div className="w-full space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{seksiNamaAktif}</h2>
          <p className="text-sm text-slate-500">Capaian periode {bulanLabel}</p>
        </div>
        <LaporanFilter periode={periodeBulan} seksiAktif={seksiAktif} seksiList={seksiList} />
        <LaporanForm periode={periodeBulan} rows={rows} />
      </div>
    </AppShell>
  )
}