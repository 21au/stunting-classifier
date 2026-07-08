import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts'
import { Loader2, TrendingUp } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const metricOptions = [
  { value: 'tinggi', label: 'Tinggi Badan (cm)' },
  { value: 'berat', label: 'Berat Badan (kg)' },
  { value: 'lingkar_kepala', label: 'Lingkar Kepala (cm)' },
]

export default function GrowthHistoryPage() {
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState('')
  const [metric, setMetric] = useState('tinggi')
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchChildren() {
      try {
        const res = await axios.get(`${API_URL}/children`)
        setChildren(res.data.children)
        if (res.data.children.length > 0) {
          setSelectedChild(res.data.children[0].anon_id)
        }
      } catch (err) {
        setError('Gagal memuat daftar data anak.')
      } finally {
        setLoadingChildren(false)
      }
    }
    fetchChildren()
  }, [])

  useEffect(() => {
    if (!selectedChild) return
    fetchForecast()
  }, [selectedChild, metric])

  async function fetchForecast() {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_URL}/forecast/${selectedChild}`, {
        params: { metric, periods: 3 }
      })
      setForecastData(res.data)
    } catch (err) {
      setError('Gagal memuat prediksi tren pertumbuhan.')
    } finally {
      setLoading(false)
    }
  }

  const chartData = forecastData ? mergeHistoricalAndForecast(forecastData) : []

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold mb-1">Riwayat & Tren Pertumbuhan</h1>
        <p className="text-muted text-sm">
          Analisis tren pertumbuhan berbasis data historis longitudinal, menggunakan model time-series (Prophet).
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Catatan:</strong> Halaman ini menampilkan analisis dari data anonim yang telah tersedia
        dalam sistem (bukan input baru). Fitur ini mendemonstrasikan kapabilitas forecasting time-series
        untuk memproyeksikan tren pertumbuhan berdasarkan riwayat pengukuran.
      </div>

      {loadingChildren ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal" /></div>
      ) : (
        <div className="bg-white border border-sage rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm text-muted font-medium">Pilih Data Anak (Anonim)</label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full mt-1 border border-sage rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                {children.map((c) => (
                  <option key={c.anon_id} value={c.anon_id}>
                    {c.anon_id} — {c.jumlah_pengukuran}x pengukuran ({c.tanggal_awal} s/d {c.tanggal_akhir})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted font-medium">Metrik</label>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="w-full mt-1 border border-sage rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                {metricOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-teal" size={28} /></div>
          ) : error ? (
            <p className="text-coral text-sm">{error}</p>
          ) : forecastData ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 mb-4 text-sm text-teal font-medium">
                <TrendingUp size={16} />
                Proyeksi 3 bulan ke depan untuk {forecastData.metric_label}
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8DE" />
                  <XAxis dataKey="ds" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8DE', fontSize: 12 }} />
                  <Legend />
                  <Area type="monotone" dataKey="range" stroke="none" fill="#0F766E" fillOpacity={0.1} name="Interval Keyakinan" />
                  <Line type="monotone" dataKey="actual" stroke="#1F2A24" strokeWidth={0} dot={{ r: 4, fill: '#1F2A24' }} name="Data Aktual" connectNulls />
                  <Line type="monotone" dataKey="yhat" stroke="#0F766E" strokeWidth={2} dot={false} name="Prediksi Tren" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          ) : null}
        </div>
      )}

      <div className="bg-white border border-sage rounded-2xl p-6">
        <h2 className="font-display font-semibold mb-2">Tentang Metode Ini</h2>
        <p className="text-sm text-ink leading-relaxed">
          Model forecasting menggunakan Facebook Prophet dengan pertumbuhan logistik (logistic growth),
          direplikasi dari metodologi penelitian tugas akhir penulis mengenai prediksi pertumbuhan balita.
          Parameter model (changepoint_prior_scale=0.005, changepoint_range=0.8) dikalibrasi untuk
          menghasilkan tren yang halus dan sesuai dengan pola pertumbuhan biologis anak.
        </p>
      </div>
    </div>
  )
}

function mergeHistoricalAndForecast(data) {
  const historicalMap = new Map(data.historical.map(h => [h.ds, h.actual]))
  return data.forecast.map(f => ({
    ds: f.ds,
    actual: historicalMap.has(f.ds) ? historicalMap.get(f.ds) : null,
    yhat: f.yhat,
    range: [f.yhat_lower, f.yhat_upper],
  }))
}