'use client'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type Item = { kode: string; nama: string; satuan: string; target: number; cumulative: number; pct: number }
type SeksiData = { nama: string; items: Item[]; avg: number }

export default function PdfButton({ bulanLabel, seksiData }: { bulanLabel: string; seksiData: SeksiData[] }) {
  function generate() {
    const doc = new jsPDF()

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('LAPORAN CAPAIAN KINERJA', 105, 16, { align: 'center' })
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Kantor Imigrasi Kelas II TPI Tanjung Balai Karimun', 105, 22, { align: 'center' })
    doc.text(`Periode s.d. ${bulanLabel}`, 105, 28, { align: 'center' })
    doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, 105, 33, { align: 'center' })

    let startY = 42

    seksiData.forEach((s) => {
      if (startY > 250) { doc.addPage(); startY = 20 }

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(`${s.nama} (Rata-rata: ${s.avg}%)`, 14, startY)

      autoTable(doc, {
        startY: startY + 4,
        head: [['Kode', 'Indikator', 'Target', 'Realisasi s.d. Bulan', 'Capaian']],
        body: s.items.map((it) => [
          it.kode,
          it.nama,
          `${it.target.toLocaleString('id-ID')} ${it.satuan}`,
          it.cumulative.toLocaleString('id-ID'),
          `${it.pct}%`,
        ]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [30, 58, 107] },
        margin: { left: 14, right: 14 },
      })

      // @ts-expect-error properti disuntikkan oleh plugin jspdf-autotable
      startY = doc.lastAutoTable.finalY + 10
    })

    doc.save(`Laporan-Kinerja-${bulanLabel.replace(/\s/g, '-')}.pdf`)
  }

  return (
    <button
      onClick={generate}
      className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 text-sm transition inline-flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Unduh PDF
    </button>
  )
}