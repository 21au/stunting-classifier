import { Printer } from 'lucide-react'

export default function PrintableSummary({ ageMonths, gender, heightCm, weightKg, result }) {
  function handlePrint() {
    window.print()
  }

  return (
    <div className="mt-4">
      <button onClick={handlePrint} className="text-sm text-teal hover:text-teal-light flex items-center gap-1.5 font-medium print:hidden">
        <Printer size={15} /> Cetak ringkasan hasil
      </button>

      <div className="hidden print:block mt-6 border border-ink p-6">
        <h2 className="font-display text-lg font-bold mb-4">Ringkasan Hasil Skrining Status Gizi</h2>
        <table className="w-full text-sm mb-4">
          <tbody>
            <tr><td className="py-1 font-medium w-40">Usia</td><td>{ageMonths} bulan</td></tr>
            <tr><td className="py-1 font-medium">Jenis Kelamin</td><td>{gender == 1 ? 'Laki-laki' : 'Perempuan'}</td></tr>
            <tr><td className="py-1 font-medium">Berat Badan</td><td>{weightKg} kg</td></tr>
            <tr><td className="py-1 font-medium">Tinggi Badan</td><td>{heightCm} cm</td></tr>
            <tr><td className="py-1 font-medium">Tanggal</td><td>{new Date().toLocaleDateString('id-ID')}</td></tr>
          </tbody>
        </table>
        {result && Object.entries(result).map(([key, data]) => (
          <p key={key} className="text-sm mb-1"><strong className="capitalize">{key}</strong>: {data.prediction.toUpperCase()}</p>
        ))}
        <p className="text-xs text-muted mt-4">
          Catatan: hasil ini adalah alat bantu skrining awal berbasis machine learning
          dan tidak menggantikan diagnosis tenaga medis profesional.
        </p>
      </div>
    </div>
  )
}