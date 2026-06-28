'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
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
      className="rounded-lg border border-white/40 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition"
    >
      Keluar
    </button>
  )
}