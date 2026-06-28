'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function tambahAkun(formData: FormData) {
  // 1. Pastikan pemanggil adalah admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak login.' }

  const { data: me } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') return { error: 'Hanya admin yang boleh menambah akun.' }

  // 2. Ambil isi formulir
  const nama_lengkap = String(formData.get('nama_lengkap') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const role = String(formData.get('role') || '')
  const seksiRaw = formData.get('seksi_id')
  const seksi_id = seksiRaw ? Number(seksiRaw) : null

  if (!nama_lengkap || !email || !password || !role) {
    return { error: 'Semua kolom wajib diisi.' }
  }
  if (role === 'pegawai' && !seksi_id) {
    return { error: 'Pegawai wajib memiliki seksi.' }
  }

  // 3. Buat akun memakai kunci sakti
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // langsung aktif, tanpa verifikasi email
    user_metadata: {
      nama_lengkap,
      role,
      seksi_id: role === 'pegawai' ? seksi_id : null,
    },
  })
  if (error) return { error: error.message }

  return { success: true }
}