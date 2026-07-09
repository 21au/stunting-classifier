import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart as LineChartIcon,
  ClipboardPlus,
  TrendingUp,
  HelpCircle,
  Trash2,
  Sparkles,
  Loader2,
  AlertTriangle,
  Info,
  ArrowRight,
  Activity
} from 'lucide-react'
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// -----------------------------------------------------------------------
// Konfigurasi API
// -----------------------------------------------------------------------
const PROPHET_API_URL = import.meta.env?.VITE_PROPHET_API_URL || ''
const MIN_DATA_POINTS = 3
const FORECAST_MONTHS = 3

// -----------------------------------------------------------------------
// Mock forecast — dipakai kalau PROPHET_API_URL belum tersedia.
// -----------------------------------------------------------------------
function mockForecast(history, metricKey) {
  const points = history
    .slice()
    .sort((a, b) => a.umur - b.umur)
    .map((h) => ({ x: h.umur, y: parseFloat(h[metricKey]) }))

  const n = points.length
  const meanX = points.reduce((s, p) => s + p.x, 0) / n
  const meanY = points.reduce((s, p) => s + p.y, 0) / n
  const num = points.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0)
  const den = points.reduce((s, p) => s + (p.x - meanX) ** 2, 0) || 1
  const slope = num / den
  const intercept = meanY - slope * meanX

  const lastUmur = points[points.length - 1].x
  const residualStd =
    Math.sqrt(
      points.reduce((s, p) => s + (p.y - (intercept + slope * p.x)) ** 2, 0) / n
    ) || 0.15

  const result = []
  for (let step = 1; step <= FORECAST_MONTHS; step++) {
    const umur = lastUmur + step
    const yhat = intercept + slope * umur
    const ci = residualStd * (1 + step * 0.35) * 1.96 
    result.push({
      umur,
      yhat: Number(yhat.toFixed(2)),
      yhatLower: Number((yhat - ci).toFixed(2)),
      yhatUpper: Number((yhat + ci).toFixed(2)),
    })
  }
  return result
}

// -----------------------------------------------------------------------
// Pemanggil API asli.
// -----------------------------------------------------------------------
async function fetchProphetForecast(history) {
  const payload = {
    data_kontrol: history
      .slice()
      .sort((a, b) => a.umur - b.umur)
      .map((h) => ({
        tanggal: h.tanggalUkur,
        umur_bulan: h.umur,
        berat: parseFloat(h.berat),
        tinggi: parseFloat(h.tinggi),
      })),
    jumlah_prediksi: FORECAST_MONTHS,
  }

  const res = await fetch(PROPHET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(`API merespons status ${res.status}`)
  const json = await res.json()

  return {
    berat: json.hasil_masa_depan.map((r) => ({
      umur: r.umur,
      yhat: r.berat.yhat,
      yhatLower: r.berat.yhat_lower,
      yhatUpper: r.berat.yhat_upper,
    })),
    tinggi: json.hasil_masa_depan.map((r) => ({
      umur: r.umur,
      yhat: r.tinggi.yhat,
      yhatLower: r.tinggi.yhat_lower,
      yhatUpper: r.tinggi.yhat_upper,
    })),
  }
}

export default function AnthropometryInputPage({ onNextStep }) {
  const [form, setForm] = useState({
    tanggalUkur: new Date().toISOString().split('T')[0],
    umur: '14',
    berat: '',
    tinggi: '',
  })

  const [history, setHistory] = useState([])
  const [activeMetric, setActiveMetric] = useState('berat') 
  const [prediction, setPrediction] = useState(null) 
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictError, setPredictError] = useState('')
  const [usingMock, setUsingMock] = useState(false)

  const hasEnoughData = history.length >= MIN_DATA_POINTS

  const handleAddEntry = (e) => {
    e.preventDefault()
    const entry = {
      id: crypto.randomUUID(),
      tanggalUkur: form.tanggalUkur,
      umur: parseInt(form.umur),
      berat: parseFloat(form.berat),
      tinggi: parseFloat(form.tinggi),
    }
    setHistory((prev) => [...prev, entry].sort((a, b) => a.umur - b.umur))
    setPrediction(null)
    setForm((f) => ({ ...f, berat: '', tinggi: '', umur: String(entry.umur + 1) }))
  }

  const handleDeleteEntry = (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id))
    setPrediction(null)
  }

  const handlePredict = async () => {
    setIsPredicting(true)
    setPredictError('')
    setUsingMock(false)
    try {
      if (!PROPHET_API_URL) throw new Error('no-api-configured')
      const result = await fetchProphetForecast(history)
      setPrediction(result)
    } catch (err) {
      setUsingMock(true)
      setTimeout(() => { // Simulasi loading agar animasi terlihat natural
        setPrediction({
          berat: mockForecast(history, 'berat'),
          tinggi: mockForecast(history, 'tinggi'),
        })
        setIsPredicting(false)
      }, 1500)
    }
  }

  const chartData = useMemo(() => {
    const key = activeMetric 
    const actualPoints = history.map((h) => ({
      umur: h.umur,
      aktual: h[key],
    }))

    if (!prediction) return actualPoints

    const lastActual = actualPoints[actualPoints.length - 1]
    const predPoints = prediction[key].map((p) => ({
      umur: p.umur,
      prediksi: p.yhat,
      ciLow: p.yhatLower,
      ciRange: p.yhatUpper - p.yhatLower,
    }))

    const bridge = lastActual
      ? [{ ...lastActual, prediksi: lastActual.aktual, ciLow: lastActual.aktual, ciRange: 0 }]
      : []

    return [...actualPoints.slice(0, -1), ...bridge, ...predPoints]
  }, [history, prediction, activeMetric])

  const referenceBand = useMemo(() => {
    if (history.length === 0) return null
    const last = history[history.length - 1][activeMetric]
    const spread = activeMetric === 'berat' ? 0.18 : 0.08
    return { low: +(last * (1 - spread)).toFixed(1), high: +(last * (1 + spread)).toFixed(1) }
  }, [history, activeMetric])

  // Hitung tren sederhana untuk infografis
  const growthInsight = useMemo(() => {
    if (history.length < 2) return null;
    const first = history[0];
    const last = history[history.length - 1];
    const weightDiff = (last.berat - first.berat).toFixed(1);
    const heightDiff = (last.tinggi - first.tinggi).toFixed(1);
    const monthDiff = last.umur - first.umur;
    
    return {
      weight: weightDiff > 0 ? `+${weightDiff}` : weightDiff,
      height: heightDiff > 0 ? `+${heightDiff}` : heightDiff,
      months: monthDiff
    };
  }, [history]);

  const unit = activeMetric === 'berat' ? 'Kg' : 'Cm'
  const label = activeMetric === 'berat' ? 'Berat Badan' : 'Tinggi Badan'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6 max-w-4xl"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 to-emerald-700 p-6 rounded-3xl text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-teal-100 mb-2">
            <Activity size={20} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
              Prophet Engine Input
            </span>
          </div>
          <h3 className="font-serif font-extrabold text-2xl tracking-tight">Data Tren Pertumbuhan</h3>
          <p className="text-sm text-teal-50/80 max-w-md mt-1">
            Input metrik bulanan untuk memproyeksikan estimasi tinggi dan berat badan anak di masa depan menggunakan Machine Learning.
          </p>
        </div>
        
        {/* Info Box Mini */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full md:w-auto">
          <p className="text-[11px] text-teal-100 font-bold uppercase mb-1">Status Data Sistem</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black">{history.length}</span>
            <span className="text-xs text-teal-50/70 mb-1.5">/ {MIN_DATA_POINTS} titik minimum</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KOLOM KIRI: FORM & NOTIFIKASI */}
        <div className="space-y-6">
          
          {/* EDUKASI PROPHET (Animated) */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-start gap-3 text-teal-900 shadow-sm"
          >
            <HelpCircle size={20} className="mt-0.5 text-teal-600 flex-shrink-0" />
            <div className="text-xs space-y-1.5">
              <p className="font-extrabold text-sm">Bagaimana Sistem Memprediksi?</p>
              <p className="text-slate-600 font-medium leading-relaxed">
                Algoritma Prophet memerlukan minimal <strong className="text-teal-700">{MIN_DATA_POINTS} titik data bulanan</strong> yang berurutan. Semakin banyak riwayat yang Anda masukkan, semakin akurat pita interval kepercayaannya.
              </p>
            </div>
          </motion.div>

          {/* FORM ENTRI DATA */}
          <form onSubmit={handleAddEntry} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Tanggal Pengukuran (ds)</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={form.tanggalUkur}
                  onChange={e => setForm({...form, tanggalUkur: e.target.value})}
                  className="w-full text-sm font-bold border border-slate-200 rounded-xl p-3 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all bg-slate-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Usia Saat Ini</label>
                <div className="relative flex items-center group">
                  <input
                    type="number"
                    required
                    value={form.umur}
                    onChange={e => setForm({...form, umur: e.target.value})}
                    className="w-full text-sm font-bold border border-slate-200 rounded-xl p-3 pr-10 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all bg-slate-50/50"
                  />
                  <span className="absolute right-3 text-[10px] font-extrabold text-slate-400 uppercase transition-colors group-focus-within:text-teal-600">Bln</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Berat Badan</label>
                <div className="relative flex items-center group">
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="0.0"
                    value={form.berat}
                    onChange={e => setForm({...form, berat: e.target.value})}
                    className="w-full text-sm font-bold border border-slate-200 rounded-xl p-3 pr-9 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all bg-slate-50/50"
                  />
                  <span className="absolute right-3 text-[10px] font-extrabold text-slate-400 uppercase transition-colors group-focus-within:text-teal-600">Kg</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Tinggi Badan</label>
                <div className="relative flex items-center group">
                  <input
                    type="number"
                    required
                    step="0.1"
                    placeholder="0.0"
                    value={form.tinggi}
                    onChange={e => setForm({...form, tinggi: e.target.value})}
                    className="w-full text-sm font-bold border border-slate-200 rounded-xl p-3 pr-9 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all bg-slate-50/50"
                  />
                  <span className="absolute right-3 text-[10px] font-extrabold text-slate-400 uppercase transition-colors group-focus-within:text-teal-600">Cm</span>
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-md mt-2"
            >
              <ClipboardPlus size={18} />
              <span>Simpan Titik Data</span>
            </motion.button>
          </form>
        </div>

        {/* KOLOM KANAN: RIWAYAT & AKSI */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Riwayat Tersimpan</p>
              <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-md font-bold">{history.length} Data</span>
            </div>
            
            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <Info size={32} className="text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-500">Belum ada data historis</p>
                <p className="text-xs text-slate-400 mt-1">Silakan input data ukur di panel sebelah kiri.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar max-h-[220px]">
                <AnimatePresence>
                  {history.map((h, i) => (
                    <motion.div 
                      key={h.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between text-xs bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl px-4 py-3 transition-colors group"
                    >
                      <div>
                        <span className="block font-bold text-slate-700 mb-0.5">Bulan ke-{h.umur}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{h.tanggalUkur}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="block font-extrabold text-teal-700">{h.berat} kg</span>
                          <span className="block font-extrabold text-emerald-600">{h.tinggi} cm</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteEntry(h.id)} 
                          className="p-2 text-slate-300 hover:bg-rose-100 hover:text-rose-500 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                          title="Hapus Data"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Smart Insight Box */}
            <AnimatePresence>
              {growthInsight && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-center justify-between text-[11px]"
                >
                  <span className="font-medium text-amber-800">Tren dalam {growthInsight.months} bulan:</span>
                  <div className="font-bold flex gap-3">
                    <span className="text-amber-600">BB {growthInsight.weight}kg</span>
                    <span className="text-amber-600">TB {growthInsight.height}cm</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handlePredict}
              disabled={!hasEnoughData || isPredicting}
              className={`w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-4 rounded-xl transition-all shadow-md mt-4 
                ${!hasEnoughData ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 hover:shadow-lg cursor-pointer'} 
                ${hasEnoughData && !prediction && !isPredicting ? 'animate-pulse' : ''}`}
            >
              {isPredicting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} className={hasEnoughData ? 'text-amber-400' : 'text-slate-400'} />
              )}
              <span>{isPredicting ? 'AI Sedang Memproses...' : `Jalankan Prediksi ${FORECAST_MONTHS} Bulan Depan`}</span>
            </button>

            {/* Error / Fallback Warnings */}
            <AnimatePresence>
              {usingMock && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 p-3 mt-3 bg-rose-50 rounded-xl border border-rose-100 text-[10px] text-rose-700 font-medium">
                  <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-rose-500" />
                  <p>API Prophet tidak terhubung. Menggunakan mode <strong className="font-bold">Proyeksi Linear Lokal</strong> untuk keperluan demonstrasi UI.</p>
                </motion.div>
              )}
              {predictError && <p className="text-[10px] text-rose-500 font-bold mt-2 text-center">{predictError}</p>}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* GRAFIK GAYA KMS/KIA (Muncul jika ada data) */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden"
          >
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
                  <LineChartIcon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">Visualisasi Kurva Pertumbuhan</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Berdasarkan data input aktual & margin proyeksi</p>
                </div>
              </div>

              {/* Toggles Interaktif */}
              <div className="flex bg-slate-100 rounded-xl p-1.5 shadow-inner">
                <button
                  onClick={() => setActiveMetric('berat')}
                  className={`text-[11px] font-bold px-4 py-2 rounded-lg transition-all cursor-pointer ${activeMetric === 'berat' ? 'bg-white text-teal-700 shadow shadow-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Berat Badan (Kg)
                </button>
                <button
                  onClick={() => setActiveMetric('tinggi')}
                  className={`text-[11px] font-bold px-4 py-2 rounded-lg transition-all cursor-pointer ${activeMetric === 'tinggi' ? 'bg-white text-teal-700 shadow shadow-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Tinggi Badan (Cm)
                </button>
              </div>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 pt-6">
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="umur"
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: 'Usia Anak (Bulan)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} 
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    unit={unit} 
                    width={50} 
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontSize: 12, fontWeight: 600 }}
                    formatter={(value, name) => [`${value} ${unit}`, name === 'aktual' ? 'Data Aktual' : name === 'prediksi' ? 'Prediksi AI' : name]}
                    labelFormatter={(label) => `Bulan ke-${label}`}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: '20px' }} 
                    iconType="circle"
                  />

                  {/* Pita CI Prediksi */}
                  <Area dataKey="ciLow" stackId="ci" stroke="none" fill="transparent" legendType="none" />
                  <Area
                    dataKey="ciRange"
                    stackId="ci"
                    stroke="none"
                    fill="#14b8a6"
                    fillOpacity={0.15}
                    name="Interval Kepercayaan AI"
                  />

                  {/* Garis Aktual */}
                  <Line
                    type="monotone"
                    dataKey="aktual"
                    stroke="#0f172a"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#0f172a', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, strokeWidth: 0 }}
                    name="Data Aktual"
                    connectNulls
                  />
                  
                  {/* Garis Prediksi (Putus-putus) */}
                  <Line
                    type="monotone"
                    dataKey="prediksi"
                    stroke="#ec4899"
                    strokeWidth={3}
                    strokeDasharray="8 6"
                    dot={{ r: 5, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, strokeWidth: 0 }}
                    name="Proyeksi Tren"
                    connectNulls
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {referenceBand && (
              <p className="text-[10px] text-slate-400 font-medium mt-4 flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Info size={14} className="text-slate-400 flex-shrink-0" />
                <span><strong className="text-slate-600">Pita hijau acuan sementara: {referenceBand.low}–{referenceBand.high} {unit}.</strong> Ini adalah aproksimasi visual ±{activeMetric === 'berat' ? '18' : '8'}% dari data aktual terakhir. Ganti dengan dataset standar kurva WHO (Z-Score) pada versi *production*.</span>
              </p>
            )}

            <AnimatePresence>
              {prediction && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  <button
                    onClick={() => onNextStep && onNextStep('cek-gizi')}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer group"
                  >
                    <span>Lanjutkan Analisis Status Gizi dengan Sistem</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}