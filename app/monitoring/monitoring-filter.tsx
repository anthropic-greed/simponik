'use client'
import { useRouter } from 'next/navigation'

export default function MonitoringFilter({ periode }: { periode: string }) {
  const router = useRouter()
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm inline-block">
      <label className="block text-xs font-medium text-slate-500 mb-1">Periode (bulan)</label>
      <input
        type="month" value={periode}
        onChange={(e) => router.push('/monitoring?periode=' + e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}