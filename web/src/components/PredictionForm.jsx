import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Activity } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const statusColors = {
  normal: '#0F766E',
  tinggi: '#14B8A6',
  stunted: '#F97362',
  'severely stunted': '#DC2626',
}

export default function PredictionForm() {
  const [ageMonths, setAgeMonths] = useState(24)
  const [gender, setGender] = useState('laki-laki')
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
        gender,
        height_cm: Number(heightCm),
      })
      setResult(res.data)
    } catch (err) {
      setError('Gagal memproses prediksi. Coba lagi dalam beberapa saat (server mungkin sedang aktif kembali dari mode tidur).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white border border-sage rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold mb-4">Cek Status Gizi</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted font-medium">Usia (bulan)</label>
            <input
              type="number" min="0" max="60" value={ageMonths}
              onChange={(e) => setAgeMonths(e.target.value)}
              className="w-full mt-1 border border-sage rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="text-sm text-muted font-medium">Jenis Kelamin</label>
            <select
              value={gender} onChange={(e) => setGender(e.target.value)}
              className="w-full mt-1 border border-sage rounded-lg px-3 py-2 focus:outline-none focus:border-teal"
            >
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted font-medium">Tinggi Badan (cm)</label>
            <input
              type="number" step="0.1" value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full mt-1 border border-sage rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-teal"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-teal text-white rounded-lg py-2.5 font-medium hover:bg-teal-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
            {loading ? 'Memproses...' : 'Prediksi'}
          </button>
        </form>
        {error && <p className="text-coral text-sm mt-3">{error}</p>}
      </div>

      <div className="bg-white border border-sage rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold mb-4">Hasil & Penjelasan</h2>
        {!result ? (
          <p className="text-muted text-sm">Isi form di sebelah kiri untuk melihat hasil prediksi.</p>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div
              className="rounded-lg p-4 text-white font-display text-lg font-semibold text-center"
              style={{ backgroundColor: statusColors[result.prediction] || '#0F766E' }}
            >
              {result.prediction.toUpperCase()}
            </div>

            <div>
              <p className="text-sm text-muted mb-2">Probabilitas tiap kelas:</p>
              {Object.entries(result.probabilities).map(([label, prob]) => (
                <div key={label} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono w-32 text-muted">{label}</span>
                  <div className="flex-1 bg-sage rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${prob * 100}%`, backgroundColor: statusColors[label] || '#0F766E' }}
                    />
                  </div>
                  <span className="text-xs font-mono w-12 text-right">{(prob * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm text-muted mb-2">Faktor paling berpengaruh (SHAP):</p>
              {result.explanation.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-sage last:border-0">
                  <span>{item.feature}</span>
                  <span className={item.contribution > 0 ? 'text-teal font-mono' : 'text-coral font-mono'}>
                    {item.contribution > 0 ? '+' : ''}{item.contribution.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}