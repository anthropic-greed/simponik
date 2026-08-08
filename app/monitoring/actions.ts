"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setujuiLaporan(indikatorId: number, periode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak login.' }

  const { data: me } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!me || (me.role !== 'monitor' && me.role !== 'admin')) {
    return { error: 'Hanya kepala kantor atau admin yang boleh menyetujui.' }
  }

  const { error } = await supabase
    .from('laporan_kinerja')
    .update({
      status_approval: 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq('indikator_id', indikatorId)
    .eq('periode', periode)

  if (error) return { error: error.message }
  revalidatePath('/monitoring')
  return { success: true }
}

export async function batalkanApproval(indikatorId: number, periode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak login.' }

  const { data: me } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!me || (me.role !== 'monitor' && me.role !== 'admin')) {
    return { error: 'Hanya kepala kantor atau admin yang boleh membatalkan.' }
  }

  const { error } = await supabase
    .from('laporan_kinerja')
    .update({ status_approval: 'pending', approved_by: null, approved_at: null })
    .eq('indikator_id', indikatorId)
    .eq('periode', periode)

  if (error) return { error: error.message }
  revalidatePath('/monitoring')
  return { success: true }
}
