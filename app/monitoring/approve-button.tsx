"use client"
import { useState, useTransition } from 'react'
import { setujuiLaporan, batalkanApproval } from './actions'

export default function ApproveButton({
  indikatorId, periode, statusApproval, approvedAt, bisaApprove,
}: {
  indikatorId: number; periode: string; statusApproval: string; approvedAt: string | null; bisaApprove: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(statusApproval)
  const [tanggal, setTanggal] = useState(approvedAt)

  const fmtTanggal = (iso: string | null) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (!bisaApprove) {
    return status === 'approved' ? (
      <div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 text-xs font-medium">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          Disetujui
        </span>
        {tanggal && <p className="text-[11px] text-slate-400 mt-1">{fmtTanggal(tanggal)}</p>}
      </div>
    ) : (
      <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-2.5 py-1 text-xs font-medium">Menunggu</span>
    )
  }

  function toggle() {
    startTransition(async () => {
      if (status === 'approved') {
        const res = await batalkanApproval(indikatorId, periode)
        if (!res?.error) { setStatus('pending'); setTanggal(null) }
      } else {
        const res = await setujuiLaporan(indikatorId, periode)
        if (!res?.error) { setStatus('approved'); setTanggal(new Date().toISOString()) }
      }
    })
  }

  return (
    <div>
      <button
        onClick={toggle}
        disabled={isPending}
        className={
          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition disabled:opacity-50 ' +
          (status === 'approved'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100')
        }
      >
        {status === 'approved' ? (
          <>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            {isPending ? '...' : 'Disetujui'}
          </>
        ) : (
          isPending ? 'Menyimpan...' : 'Setujui'
        )}
      </button>
      {status === 'approved' && tanggal && (
        <p className="text-[11px] text-slate-400 mt-1">Disetujui {fmtTanggal(tanggal)}</p>
      )}
    </div>
  )
}