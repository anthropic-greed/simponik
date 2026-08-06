export function hitungCapaian(
  target: number,
  laporanBulanan: { periode: string; realisasi: number | string }[],
  periodeBulan: string,
  otomatisAktif: boolean
) {
  const isTahunan = otomatisAktif && target === 1

  if (isTahunan) {
    const parts = periodeBulan.split('-')
    const yy = parts[0]
    const bulanKe = Number(parts[1])

    if (bulanKe < 12) {
      const pct = Math.round((bulanKe / 12) * 100)
      return { cumulative: bulanKe, pct: pct, isTahunan: true as const, needsInput: false }
    }

    const desemberPeriode = yy + '-12-01'
    const sudahDikonfirmasi = laporanBulanan.some(function (l) {
      return l.periode === desemberPeriode && Number(l.realisasi) > 0
    })

    if (sudahDikonfirmasi) {
      return { cumulative: 12, pct: 100, isTahunan: true as const, needsInput: false }
    }
    const pctBelum = Math.round((11 / 12) * 100)
    return { cumulative: 11, pct: pctBelum, isTahunan: true as const, needsInput: true }
  }

  const cumulative = laporanBulanan.reduce(function (a, l) {
    return a + Number(l.realisasi)
  }, 0)
  const pct = target > 0 ? Math.round((cumulative / target) * 100) : 0
  return { cumulative: cumulative, pct: pct, isTahunan: false as const, needsInput: false }
}