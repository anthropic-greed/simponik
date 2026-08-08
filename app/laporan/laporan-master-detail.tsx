'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { simpanLaporan } from './actions'

type Baris = {
  indikatorId: number; kode: string; nama: string; satuan: string
  target: number; current: number | null; cumulative: number; pct: number
  isTahunan: boolean; needsInput: boolean; statusApproval: string
}

const fmt = (n: number) => n.toLocaleString('id-ID')

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 text-xs font-medium shrink-0">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        Disetujui
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-2.5 py-1 text-xs font-medium shrink-0">
      Menunggu
    </span>
  )
}

function CircularProgress({ pct }: { pct: number }) {
  const r = 30
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(pct, 100) / 100) * c
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
      <circle
        cx="32" cy="32" r={r} fill="none" stroke="#1e3a6b" strokeWidth="7"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
    </svg>
  )
}

export default function LaporanMasterDetail({
  periode, bulanLabel, seksiNama, rows,
}: {
  periode: string; bulanLabel: string; seksiNama: string; rows: Baris[]
}) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<number | null>(rows[0]?.indikatorId ?? null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const selected = rows.find((r) => r.indikatorId === selectedId) ?? rows[0]

  const rowsPerluDiisi = rows.filter((r) => !r.isTahunan || r.needsInput)
  const terisi = rowsPerluDiisi.filter((r) => r.current !== null).length
  const belum = rowsPerluDiisi.length - terisi
  const progressPelaporan = rowsPerluDiisi.length ? Math.round((terisi / rowsPerluDiisi.length) * 100) : 100

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const res = await simpanLaporan(new FormData(e.currentTarget))
    setLoading(false)
    if (res?.error) setMsg({ ok: false, text: res.error })
    else { setMsg({ ok: true, text: 'Capaian berhasil disimpan.' }); router.refresh() }
  }

  if (rows.length === 0) {
    return <div className="bg-white border border-slate-200 rounded-2xl p-8 text-slate-500">Belum ada indikator untuk seksi ini.</div>
  }

  const barColor = (p: number) => (p >= 100 ? 'bg-emerald-500' : p >= 50 ? 'bg-blue-500' : 'bg-amber-500')

  return (
    <div className="space-y-5">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Progress Keseluruhan</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{progressPelaporan}%</p>
            <p className="text-xs text-slate-400 mt-1">{terisi} dari {rowsPerluDiisi.length} indikator</p>
          </div>
          <CircularProgress pct={progressPelaporan} />
        </div>
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Indikator Terisi</p>
            <p className="text-2xl font-bold text-emerald-700 mt-0.5">{terisi}</p>
            <p className="text-xs text-slate-400">dari {rowsPerluDiisi.length} indikator</p>
          </div>
        </div>
        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Indikator Belum Isi</p>
            <p className="text-2xl font-bold text-amber-700 mt-0.5">{belum}</p>
            <p className="text-xs text-slate-400">dari {rowsPerluDiisi.length} indikator</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Daftar Indikator</p>
          </div>
          <ul className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
            {rows.map((r) => {
              const isActive = r.indikatorId === selectedId
              const belumIsi = !r.isTahunan && r.current === null
              return (
                <li key={r.indikatorId}>
                  <button
                    type="button"
                    onClick={() => { setSelectedId(r.indikatorId); setMsg(null) }}
                    className={'w-full text-left px-5 py-3.5 flex items-center gap-3 transition ' + (isActive ? 'bg-blue-50' : 'hover:bg-slate-50')}
                  >
                    <div className={'w-2 h-2 rounded-full shrink-0 ' + (belumIsi ? 'bg-amber-500' : 'bg-emerald-500')} />
                    <div className="flex-1 min-w-0">
                      <p className={'text-sm truncate ' + (isActive ? 'font-semibold text-blue-900' : 'font-medium text-slate-700')}>{r.nama}</p>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1.5">
                        <div className={'h-full ' + barColor(r.pct)} style={{ width: `${Math.min(r.pct, 100)}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 shrink-0 tabular-nums">{r.pct}%</span>
                    {r.statusApproval === 'approved' && (
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    )}
                    <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          {selected && (
            <>
              <div className="flex items-start justify-between gap-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h1M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900">{selected.nama}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{selected.kode}</p>
                  </div>
                </div>
                <StatusBadge status={selected.statusApproval} />
              </div>

              {selected.isTahunan && !selected.needsInput ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Target</p>
                      <p className="text-lg font-bold text-slate-900">1 Layanan</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Progres berjalan</p>
                      <p className="text-lg font-bold text-slate-900">Bulan ke-{selected.cumulative} / 12</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Capaian otomatis</p>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className={'h-full ' + barColor(selected.pct)} style={{ width: `${Math.min(selected.pct, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-sm text-blue-800">Progres berjalan otomatis mengikuti bulan berjalan. Konfirmasi manual diperlukan di bulan Desember.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  <input type="hidden" name="periode" value={periode} />
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Target Setahun</p>
                      <p className="text-lg font-bold text-slate-900">{fmt(selected.target)} <span className="text-sm font-normal text-slate-400">{selected.satuan}</span></p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Capaian Bulan Ini</p>
                      <input
                        name={`realisasi_${selected.indikatorId}`}
                        type="number" min={0} step="any"
                        defaultValue={selected.current ?? ''}
                        placeholder={selected.needsInput ? '1' : '0'}
                        key={selected.indikatorId}
                        className={
                          'w-24 rounded-lg border px-2 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 ' +
                          (selected.needsInput
                            ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500')
                        }
                      />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Total s.d. Bulan Ini</p>
                      <p className="text-lg font-bold text-slate-900">{selected.isTahunan ? `${selected.cumulative}/12` : fmt(selected.cumulative)}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-xs text-slate-500 mb-2">Capaian terhadap Target</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className={'h-full ' + barColor(selected.pct)} style={{ width: `${Math.min(selected.pct, 100)}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 tabular-nums">{selected.pct}%</span>
                    </div>
                  </div>

                  {selected.needsInput && (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
                      <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                      <p className="text-sm text-amber-800">Isi angka (misal 1) untuk menandai layanan ini tuntas 100% di bulan Desember.</p>
                    </div>
                  )}

                  {selected.statusApproval === 'approved' && (
                    <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-5">
                      <svg className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="text-sm text-emerald-800">Capaian ini sudah disetujui oleh Kepala Kantor. Mengubah angka akan membatalkan persetujuan.</p>
                    </div>
                  )}

                  <div className="flex items-start gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-5">
                    <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-sm text-slate-500">Isi capaian bulan ini lalu simpan. Kolom kosong tidak diubah.</p>
                  </div>

                  {msg && (
                    <p className={'text-sm rounded-lg px-3 py-2 mb-4 ' + (msg.ok ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50')}>{msg.text}</p>
                  )}

                  <button type="submit" disabled={loading}
                    className="rounded-lg bg-blue-900 hover:bg-blue-950 disabled:opacity-60 text-white font-medium px-5 py-2.5 text-sm transition inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-6 0V3h6v4m-6 0h6" /></svg>
                    {loading ? 'Menyimpan…' : 'Simpan Capaian'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {belum > 0 && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">Peringatan pelaporan {bulanLabel}</p>
              <p className="text-sm text-amber-700 mt-0.5">Masih ada {belum} dari {rowsPerluDiisi.length} indikator yang belum dilaporkan bulan ini. Segera lengkapi capaian di atas.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
