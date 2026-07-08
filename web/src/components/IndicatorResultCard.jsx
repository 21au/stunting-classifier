import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Stethoscope } from 'lucide-react'

const statusColors = {
  normal: '#0F766E', tinggi: '#14B8A6', stunted: '#F97362', 'severely stunted': '#DC2626',
  underweight: '#F97362', 'severely underweight': '#DC2626', overweight: '#14B8A6',
  wasted: '#F97362', 'severely wasted': '#DC2626', obese: '#14B8A6',
}

const indicatorLabels = { stunting: 'Stunting (Tinggi/Usia)', underweight: 'Underweight (Berat/Usia)', wasting: 'Wasting (Berat/Tinggi)' }

export default function IndicatorResultCard({ indicatorKey, data }) {
  const [mode, setMode] = useState('layman')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-sage rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-semibold">{indicatorLabels[indicatorKey]}</h3>
        <div
          className="px-3 py-1 rounded-full text-xs font-mono text-white"
          style={{ backgroundColor: statusColors[data.prediction] || '#0F766E' }}
        >
          {data.prediction.toUpperCase()}
        </div>
      </div>

      <div className="flex gap-1 mb-4 bg-sage/40 rounded-lg p-1 w-fit">
        <button
          onClick={() => setMode('layman')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === 'layman' ? 'bg-white text-teal shadow-sm' : 'text-muted'}`}
        >
          <Users size={13} /> Untuk Orang Tua
        </button>
        <button
          onClick={() => setMode('clinical')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === 'clinical' ? 'bg-white text-teal shadow-sm' : 'text-muted'}`}
        >
          <Stethoscope size={13} /> Untuk Tenaga Kesehatan
        </button>
      </div>

      <p className="text-sm text-ink mb-4">
        {mode === 'layman' ? data.layman_summary : data.clinical_summary}
      </p>

      {mode === 'clinical' && (
        <p className="text-xs text-muted italic mb-4">Referensi: {data.reference}</p>
      )}

      <div className="mb-3">
        <p className="text-xs text-muted mb-2">Probabilitas tiap kelas:</p>
        {Object.entries(data.probabilities).map(([label, prob]) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono w-32 text-muted truncate">{label}</span>
            <div className="flex-1 bg-sage rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${prob * 100}%`, backgroundColor: statusColors[label] || '#0F766E' }} />
            </div>
            <span className="text-xs font-mono w-10 text-right">{(prob * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      {mode === 'clinical' && (
        <div>
          <p className="text-xs text-muted mb-1">Faktor paling berpengaruh (SHAP):</p>
          {data.explanation.map((item, i) => (
            <div key={i} className="flex justify-between text-xs py-0.5">
              <span className="text-muted">{item.feature}</span>
              <span className={item.contribution > 0 ? 'text-teal font-mono' : 'text-coral font-mono'}>
                {item.contribution > 0 ? '+' : ''}{item.contribution.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}