'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButtonClient() {
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={logout}
      className="rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 transition whitespace-nowrap"
    >
      Keluar
    </button>
  )
}

export function LogoutButton() {
  return <LogoutButtonClient />
}
