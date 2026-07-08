import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Activity } from 'lucide-react'
import axios from 'axios'
import IndicatorResultCard from '../components/IndicatorResultCard'
import GrowthChart from '../components/GrowthChart'
import PrintableSummary from '../components/PrintableSummary'

const API_URL = import.meta.env.VITE_API_URL

export default function ClassifierPage() {
  const [ageMonths, setAgeMonths] = useState(24)
  const [gender, setGender] = useState(0)
  const [weightKg, setWeightKg] = useState(9.5)
  const [heightCm, setHeightCm] = useState(78)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await axios.post(`${API_URL}/predict`, {
        age_months: Number(ageMonths),
        gender: Number(gender),
        weight_kg: Number(weightKg),
        height_cm: Number(heightCm),
      })
      setResult(res.data)
    } catch (err) {
      setError('Gagal memproses prediksi. Server mungkin sedang aktif kembali dari mode tidur, coba lagi dalam beberapa saat.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold mb-1">Cek Status Gizi</h1>
        <p className="text-muted text-sm">Masukkan data antropometri anak untuk melihat hasil klasifikasi 3 indikator gizi.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-sage rounded-2xl p-6 md:col-span-1 h-fit">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted font-medium">Usia (bulan)</label>
              <input type="number" min="0" max="60" value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)}
                className="w-full mt-1 border border-sage rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-teal" />
            </div>
            <div>
              <label className="text-sm text-muted font-medium">Jenis Kelamin</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}
                className="w-full mt-1 border border-sage rounded-lg px-3 py-2 focus:outline-none focus:border-teal">
                <option value={0}>Perempuan</option>
                <option value={1}>Laki-laki</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted font-medium">Berat Badan (kg)</label>
              <input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)}
                className="w-full mt-1 border border-sage rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-teal" />
            </div>
            <div>
              <label className="text-sm text-muted font-medium">Tinggi Badan (cm)</label>
              <input type="number" step="0.1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
                className="w-full mt-1 border border-sage rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-teal" />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full bg-teal text-white rounded-lg py-2.5 font-medium hover:bg-teal-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
              {loading ? 'Memproses...' : 'Prediksi'}
            </motion.button>
          </form>
          {error && <p className="text-coral text-sm mt-3">{error}</p>}
        </div>

        <div className="md:col-span-2 space-y-4">
          {!result ? (
            <div className="bg-white border border-sage rounded-2xl p-6 text-muted text-sm">
              Isi form di sebelah kiri untuk melihat hasil klasifikasi 3 indikator gizi.
            </div>
          ) : (
            <>
              {Object.entries(result).map(([key, data]) => (
                <IndicatorResultCard key={key} indicatorKey={key} data={data} />
              ))}
              <GrowthChart childAge={Number(ageMonths)} childHeight={Number(heightCm)} />
              <PrintableSummary ageMonths={ageMonths} gender={gender} heightCm={heightCm} weightKg={weightKg} result={result} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}