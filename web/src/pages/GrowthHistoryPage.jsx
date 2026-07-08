import { useState, useMemo } from 'react'
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, ReferenceLine, Line
} from 'recharts'
import { User, Activity, TrendingUp, TrendingDown, Calendar, ChevronDown } from 'lucide-react'

// Data Anak
const childrenData = [
  { id: 'anak-1', name: 'Bima Saputra', gender: 'L', dob: '2022-03-15' },
  { id: 'anak-2', name: 'Siti Rahma', gender: 'P', dob: '2021-09-01' },
  { id: 'anak-3', name: 'Damar Wicaksono', gender: 'L', dob: '2023-01-20' },
]

// Generator simulasi histori & prediksi
function generateHistory(childId, metric) {
  const seed = childId === 'anak-1' ? 1 : childId === 'anak-2' ? 2 : 3
  const base = {
    tinggi: [48, 54, 58, 62, 65, 67.5, 70, 72, 74, 76, 77.5, 79, 80.5],
    berat: [3.2, 4.5, 5.8, 6.8, 7.5, 8.0, 8.4, 8.8, 9.1, 9.4, 9.7, 10.0, 10.3],
    haz: [0.2, 0.1, -0.2, -0.5, -0.8, -1.1, -1.4, -1.6, -1.7, -1.9, -2.0, -2.1, -2.2],
    waz: [0.1, 0.3, 0.0, -0.3, -0.5, -0.7, -0.9, -1.0, -1.2, -1.3, -1.4, -1.5, -1.5],
  }

  const variation = seed * 0.15
  const obs = base[metric].map((v, i) => ({
    usia: i * 2,
    value: Math.round((v + (Math.random() - 0.5) * variation) * 10) / 10,
  }))

  const lastVal = obs[obs.length - 1].value
  const trend = (obs[obs.length - 1].value - obs[obs.length - 4].value) / 3
  
  const predicted = Array.from({ length: 6 }, (_, i) => {
    const next = lastVal + trend * (i + 1) + (Math.random() - 0.5) * 0.3
    return {
      usia: (obs.length - 1 + i + 1) * 2,
      value: undefined,
      predicted: Math.round(next * 10) / 10,
      ci_lower: Math.round((next - 0.5 - i * 0.1) * 10) / 10,
      ci_upper: Math.round((next + 0.5 + i * 0.1) * 10) / 10,
    }
  })

  return [...obs, ...predicted]
}

const metricOptions = [
  { id: 'tinggi', label: 'Tinggi Badan', unit: 'cm', yLabel: 'Tinggi (cm)' },
  { id: 'berat', label: 'Berat Badan', unit: 'kg', yLabel: 'Berat (kg)' },
  { id: 'haz', label: 'Z-score HAZ', unit: 'SD', yLabel: 'HAZ (SD)' },
  { id: 'waz', label: 'Z-score WAZ', unit: 'SD', yLabel: 'WAZ (SD)' },
]

// Custom Tooltip Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl p-3.5 shadow-xl min-w-[140px]">
      <div className="font-mono text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
        <Calendar size={12} /> Usia: {label} Bulan
      </div>
      <div className="space-y-1.5">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span>{p.name}:</span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-800">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RiwayatPertumbuhan() {
  const [selectedChild, setSelectedChild] = useState('anak-1')
  const [selectedMetric, setSelectedMetric] = useState('tinggi')

  const data = useMemo(() => generateHistory(selectedChild, selectedMetric), [selectedChild, selectedMetric])
  const observed = data.filter((d) => d.value !== undefined)
  const child = childrenData.find((c) => c.id === selectedChild)
  const metric = metricOptions.find((m) => m.id === selectedMetric)

  const isZscore = selectedMetric === 'haz' || selectedMetric === 'waz'
  const lastObs = observed[observed.length - 1]
  const trend = observed.length > 3
    ? (observed[observed.length - 1].value - observed[observed.length - 4].value) / 3
    : 0

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 pb-16">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-teal-700 text-xs font-bold uppercase tracking-widest block mb-1">
            Pemantauan Longitudinal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            Riwayat Pertumbuhan Balita
          </h1>
        </div>

        {/* Controls Panel */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-5 items-stretch md:items-center">
          <div className="flex flex-col gap-1.5 flex-1 max-w-sm">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User size={12} /> Pilih Data Anak
            </label>
            <div className="relative">
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-600/5 appearance-none cursor-pointer transition-all"
              >
                {childrenData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.gender === 'L' ? 'Laki-laki' : 'Perempuan'})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Activity size={12} /> Pilih Parameter Gizi
            </label>
            <div className="flex flex-wrap gap-2">
              {metricOptions.map((m) => {
                const isActive = selectedMetric === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMetric(m.id)}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-700 text-white border-teal-700 shadow-sm shadow-teal-700/10'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Pengukuran Terakhir
            </div>
            <div className="font-mono text-2xl font-bold text-teal-800 mb-1">
              {lastObs.value} <span className="text-sm font-sans font-medium text-slate-400">{metric.unit}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Tercatat pada usia {lastObs.usia} bulan
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Jumlah Kunjungan
            </div>
            <div className="font-mono text-2xl font-bold text-teal-800 mb-1">
              {observed.length} <span className="text-sm font-sans font-medium text-slate-400">Log</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Total riwayat di puskesmas
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Tren Kecepatan (3 bln terakhir)
            </div>
            <div className="font-mono text-2xl font-bold text-teal-800 mb-1 flex items-baseline gap-1">
              <span>{trend >= 0 ? '+' : ''}{trend.toFixed(2)}</span>
              <span className="text-xs font-sans font-medium text-slate-400">{metric.unit}/2bln</span>
            </div>
            <div className={`text-xs font-bold flex items-center gap-1 ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend >= 0 ? 'Pertumbuhan Positif' : 'Indikasi Deselerasi'}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900">
                Grafik Proyeksi: {child.name}
              </h2>
              <p className="text-xs text-slate-400">Analisis data aktual berkala vs prediksi tren interpolasi linier</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-teal-700 rounded-full" /> Terukur
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 border-b-2 border-dashed border-orange-400" /> Prediksi
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 bg-orange-400/10 rounded-sm" /> Interval Kepercayaan
              </div>
            </div>
          </div>

          <div className="w-full h-[360px] text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <defs>
                  <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB923C" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#FB923C" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="usia" tick={{ fill: '#94A3B8', fontFamily: 'monospace' }} />
                <YAxis tick={{ fill: '#94A3B8', fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />

                {isZscore && (
                  <>
                    <ReferenceLine y={0} stroke="#10B981" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: 'Median (Ideal)', position: 'insideRight', fill: '#10B981', fontSize: 10, fontWight: 600 }} />
                    <ReferenceLine y={-2} stroke="#F59E0B" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: '-2 SD (Ambang Stunting)', position: 'insideRight', fill: '#F59E0B', fontSize: 10, fontWeight: 600 }} />
                    <ReferenceLine y={-3} stroke="#EF4444" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: '-3 SD (Kritis)', position: 'insideRight', fill: '#EF4444', fontSize: 10, fontWeight: 600 }} />
                  </>
                )}

                <Area type="monotone" dataKey="ci_upper" stroke="transparent" fill="url(#ciGradient)" activeDot={false} legendType="none" />
                <Area type="monotone" dataKey="ci_lower" stroke="transparent" fill="url(#ciGradient)" activeDot={false} legendType="none" />
                <Line type="monotone" dataKey="value" stroke="#0F766E" strokeWidth={3} dot={{ fill: '#0F766E', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#0F766E' }} name="Terukur" />
                <Line type="monotone" dataKey="predicted" stroke="#FB923C" strokeWidth={2.5} strokeDasharray="6 4" dot={{ fill: '#FB923C', r: 3.5, strokeWidth: 0 }} name="Prediksi" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <h3 className="text-sm font-bold font-serif text-slate-900">
              Log Rekam Medis Pengukuran Terakhir (8 Kunjungan)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Usia (Bulan)</th>
                  <th className="px-6 py-3.5">{metric.label}</th>
                  <th className="px-6 py-3.5">Delta Perubahan</th>
                  <th className="px-6 py-3.5">Klasifikasi Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {observed.slice(-8).reverse().map((d, i, arr) => {
                  const prev = arr[i + 1]
                  const change = prev ? d.value - prev.value : null
                  const isCritical = isZscore && d.value < -2

                  return (
                    <tr key={d.usia} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-slate-900">{d.usia}</td>
                      <td className="px-6 py-3.5">
                        <span className={`font-mono text-sm font-bold ${isCritical ? 'text-rose-600' : 'text-teal-700'}`}>
                          {d.value} {metric.unit}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        {change !== null ? (
                          <span className={`font-mono flex items-center gap-0.5 text-xs font-bold ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        {isZscore ? (
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block ${
                            d.value >= -1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            d.value >= -2 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            d.value >= -3 ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {d.value >= -1 ? 'Normal' : d.value >= -2 ? 'Ringan (Underweight/Short)' : d.value >= -3 ? 'Sedang' : 'Berat'}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-xs font-normal">N/A (Metrik Absolut)</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}