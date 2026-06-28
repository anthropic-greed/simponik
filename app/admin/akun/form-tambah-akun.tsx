'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { tambahAkun } from './actions'

type Seksi = { id: number; nama: string }
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
const labelCls = 'block text-sm font-medium text-slate-700 mb-1'

export default function FormTambahAkun({ seksiList }: { seksiList: Seksi[] }) {
  const router = useRouter()
  const [role, setRole] = useState('pegawai')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setLoading(true); setMsg(null)
    const res = await tambahAkun(new FormData(form))
    setLoading(false)
    if (res?.error) setMsg({ ok: false, text: res.error })
    else { setMsg({ ok: true, text: 'Akun berhasil dibuat.' }); form.reset(); setRole('pegawai'); router.refresh() }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>Nama lengkap</label><input name="nama_lengkap" required className={inputCls} /></div>
        <div><label className={labelCls}>Email</label><input name="email" type="email" required className={inputCls} /></div>
        <div><label className={labelCls}>Password awal</label><input name="password" type="text" required minLength={6} className={inputCls} placeholder="Min. 6 karakter" /></div>
        <div>
          <label className={labelCls}>Role</label>
          <select name="role" value={role} onChange={(e) => setRole(e.target.value)} className={inputCls}>
            <option value="pegawai">Pegawai</option>
            <option value="monitor">Monitor (Kepala Kantor)</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {role === 'pegawai' && (
          <div className="sm:col-span-2">
            <label className={labelCls}>Seksi</label>
            <select name="seksi_id" required className={inputCls}>
              <option value="">— Pilih seksi —</option>
              {seksiList.map((s) => (<option key={s.id} value={s.id}>{s.nama}</option>))}
            </select>
          </div>
        )}
      </div>
      {msg && (
        <p className={'text-sm rounded-lg px-3 py-2 border ' + (msg.ok ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100')}>{msg.text}</p>
      )}
      <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition">
        {loading ? 'Menyimpan…' : 'Tambah akun'}
      </button>
    </form>
  )
}