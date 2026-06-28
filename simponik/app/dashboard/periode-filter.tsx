'use client'
import { useRouter } from 'next/navigation'

export default function PeriodeFilter({ periode }: { periode: string }) {
  const router = useRouter()
  return (
    <input
      type="month" value={periode}
      onChange={(e) => router.push('/dashboard?periode=' + e.target.value)}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  )
}