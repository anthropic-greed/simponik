'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LaporanFilter({
  periode, seksiAktif, seksiList,
}: {
  periode: string
  seksiAktif: number
  seksiList: { id: number; nama: string }[] | null
}) {
  const router = useRouter()
  const params = useSearchParams()

  function update(key: string, value: string) {
    const p = new URLSearchParams(params.toString())
    p.set(key, value)
    router.push('/laporan?' + p.toString())
  }

  const cls = 'rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

  return (
    <div className="flex flex-wrap items-end gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Periode (bulan)</label>
        <input type="month" value={periode} onChange={(e) => update('periode', e.target.value)} className={cls} />
      </div>
      {seksiList && (
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Seksi</label>
          <select value={String(seksiAktif)} onChange={(e) => update('seksi', e.target.value)} className={cls}>
            {seksiList.map((s) => (<option key={s.id} value={s.id}>{s.nama}</option>))}
          </select>
        </div>
      )}
    </div>
  )
}