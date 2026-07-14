'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function simpanLaporan(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak login.' }

  const { data: me } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!me || (me.role !== 'admin' && me.role !== 'pegawai')) {
    return { error: 'Tidak berwenang menyimpan.' }
  }

  const periodeBulan = String(formData.get('periode') || '')
  if (!/^\d{4}-\d{2}$/.test(periodeBulan)) return { error: 'Periode tidak valid.' }
  const periode = `${periodeBulan}-01`

  const rows: { indikator_id: number; periode: string; realisasi: number }[] = []
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('realisasi_')) continue
    const v = String(value).trim()
    if (v === '') continue
    const num = Number(v)
    if (Number.isNaN(num) || num < 0) continue
    rows.push({
      indikator_id: Number(key.slice('realisasi_'.length)),
      periode,
      realisasi: num,
    })
  }

  if (rows.length === 0) {
    return { error: 'Belum ada angka yang diisi.', debug: 'rows kosong — tidak ada input yang terbaca dari form.' }
  }

  const { error } = await supabase
    .from('laporan_kinerja')
    .upsert(rows, { onConflict: 'indikator_id,periode' })

  if (error) {
    return { error: error.message, debug: JSON.stringify(error) }
  }

  revalidatePath('/laporan')
  return { success: true, debug: `Tersimpan ${rows.length} baris: ${JSON.stringify(rows)}` }
}