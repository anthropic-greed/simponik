 'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { simpanLaporan } from './actions'

type Baris = {
  indikatorId: number; kode: string; nama: string; satuan: string
  target: number; current: number | null; cumulative: number
}

const fmt = (n: number) => n.toLocaleString('id-ID')

function Toast({ ok, text, onClose }: { ok: boolean; text: string; onClose: () => void }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 10)
    const t2 = setTimeout(() => setShow(false), 3200)
    const t3 = setTimeout(onClose, 3500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onClose])

  return (
    <div
      className={
        'fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out ' +
        (show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3')
      }
    >
      <div className="flex items-start gap-3 bg-white rounded-xl shadow-2xl border border-slate-200 px-4 py-3.5 max-w-sm">
        <div
          className={
            'shrink-0 w-8 h-8 rounded-full flex items-center justify-center ' +
            (ok ? 'bg-emerald-100' : 'bg-red-100')
          }
        >
          {ok ? (
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm font-semibold text-slate-900">{ok ? 'Berhasil disimpan' : 'Gagal disimpan'}</p>
          <p className="text-sm text-slate-500 mt-0.5">{text}</p>
        </div>
      </div>
    </div>
  )
}

export default function LaporanForm({ periode, rows }: { periode: string; rows: Baris[] }) {
  const router = useRouter()
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const res = await simpanLaporan(new FormData(e.currentTarget))
    setLoading(false)
    if (res?.error) {
      setToast({ ok: false, text: res.error })
    } else {
      setToast({ ok: true, text: 'Capaian kinerja telah tercatat di sistem.' })
      router.refresh()
    }
  }

  if (rows.length === 0) {
    return <div className="bg-white border border-slate-200 rounded-xl p-8 text-slate-500">Belum ada indikator untuk seksi ini.</div>
  }

  return (
    <>
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
            <span className="text-xs text-slate-400">Isi capaian bulan ini lalu simpan. Kolom kosong tidak diubah.</span>
            <button type="submit" disabled={loading}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition whitespace-nowrap">
              {loading ? 'Menyimpan…' : 'Simpan capaian'}
            </button>
          </div>
        </div>
      </form>

      {toast && <Toast ok={toast.ok} text={toast.text} onClose={() => setToast(null)} />}
    </>
  )
}