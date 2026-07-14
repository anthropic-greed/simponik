'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { simpanLaporan } from './actions'

type Baris = {
  indikatorId: number; kode: string; nama: string; satuan: string
  target: number; current: number | null; cumulative: number
}

const fmt = (n: number) => n.toLocaleString('id-ID')

export default function LaporanForm({ periode, rows }: { periode: string; rows: Baris[] }) {
  const router = useRouter()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const res = await simpanLaporan(new FormData(e.currentTarget))
    setLoading(false)
    if (res?.error) {
      setMsg({ ok: false, text: res.error + (res.debug ? ' — DEBUG: ' + res.debug : '') })
    } else {
      setMsg({ ok: true, text: 'Capaian berhasil disimpan. DEBUG: ' + (res?.debug || '(tidak ada info debug)') })
      router.refresh()
    }
  }

  if (rows.length === 0) {
    return <div className="bg-white border border-slate-200 rounded-xl p-8 text-slate-500">Belum ada indikator untuk seksi ini.</div>
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="periode" value={periode} />
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-3 min-w-[220px]">Indikator</th>
                <th className="text-right font-medium px-4 py-3">Target setahun</th>
                <th className="text-left font-medium px-4 py-3">Capaian bulan ini</th>
                <th className="text-right font-medium px-4 py-3">Total s.d. bulan ini</th>
                <th className="text-left font-medium px-4 py-3 min-w-[160px]">Capaian thd target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => {
                const pct = r.target > 0 ? Math.round((r.cumulative / r.target) * 100) : 0
                const barColor = pct >= 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                return (
                  <tr key={r.indikatorId} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{r.nama}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{r.kode}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap tabular-nums">
                      {fmt(r.target)} <span className="text-slate-400">{r.satuan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        name={`realisasi_${r.indikatorId}`}
                        type="number" min={0} step="any"
                        defaultValue={r.current ?? ''}
                        placeholder="0"
                        className="w-28 rounded-lg border border-slate-300 px-2 py-1.5 text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700 whitespace-nowrap tabular-nums">{fmt(r.cumulative)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-600 w-10 text-right tabular-nums">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-slate-50">
          {msg
            ? <p className={`text-sm ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg.text}</p>
            : <span className="text-xs text-slate-400">Isi capaian bulan ini lalu simpan. Kolom kosong tidak diubah.</span>}
          <button type="submit" disabled={loading}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition whitespace-nowrap">
            {loading ? 'Menyimpan…' : 'Simpan capaian'}
          </button>
        </div>
      </div>
    </form>
  )
}