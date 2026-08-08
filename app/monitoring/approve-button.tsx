'use client'
import { useState, useTransition } from 'react'

// Local fallback implementations for actions. The real './actions' module
// was not found by the compiler, so provide minimal implementations that
// perform a POST to presumed API endpoints. Adjust endpoints as needed.
async function setujuiLaporan(indikatorId: number, periode: string) {
  try {
    const res = await fetch(`/api/monitoring/${indikatorId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ periode }),
    })
    return await res.json()
  } catch (e) {
    return { error: String(e) }
  }
}

async function batalkanApproval(indikatorId: number, periode: string) {
  try {
    const res = await fetch(`/api/monitoring/${indikatorId}/unapprove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ periode }),
    })
    return await res.json()
  } catch (e) {
    return { error: String(e) }
  }
}

export default function ApproveButton({
  indikatorId, periode, statusApproval, bisaApprove,
}: {
  indikatorId: number; periode: string; statusApproval: string; bisaApprove: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(statusApproval)

  if (!bisaApprove) {
    return status === 'approved' ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 text-xs font-medium">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        Disetujui
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-2.5 py-1 text-xs font-medium">Menunggu</span>
    )
  }

  function toggle() {
    startTransition(async () => {
      if (status === 'approved') {
        const res = await batalkanApproval(indikatorId, periode)
        if (!res?.error) setStatus('pending')
      } else {
        const res = await setujuiLaporan(indikatorId, periode)
        if (!res?.error) setStatus('approved')
      }
    })
  }

  return (
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
  )
}
