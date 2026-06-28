import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type Role = 'admin' | 'pegawai' | 'monitor'

export async function requireProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nama_lengkap, role, seksi_id, seksi ( nama )')
    .eq('id', user.id)
    .single()
  if (!profile) redirect('/login')

  const seksiNama = Array.isArray(profile.seksi)
    ? profile.seksi[0]?.nama
    : (profile.seksi as { nama?: string } | null)?.nama

  return {
    supabase,
    user,
    nama: profile.nama_lengkap || user.email!,
    role: profile.role as Role,
    seksiId: profile.seksi_id as number | null,
    seksiNama: seksiNama as string | undefined,
  }
}