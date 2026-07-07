import { motion } from 'framer-motion'

export default function GrowthCurveHero() {
  return (
    <div className="relative overflow-hidden border-b border-sage">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-xs text-coral tracking-widest uppercase mb-3"
        >
          AI-Powered Growth Screening
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-tight max-w-2xl"
        >
          Stunting Risk Classifier
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-muted mt-3 max-w-lg"
        >
          Sistem klasifikasi status gizi balita berbasis machine learning,
          dilengkapi penjelasan transparan di balik setiap prediksi.
        </motion.p>
      </div>

      <svg
        viewBox="0 0 800 200"
        className="absolute bottom-0 left-0 w-full h-24 opacity-40"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 180 Q 200 180 300 120 T 500 60 T 800 20"
          fill="none"
          stroke="#0F766E"
          strokeWidth="3"
          className="growth-curve-path"
        />
      </svg>
    </div>
  )
}