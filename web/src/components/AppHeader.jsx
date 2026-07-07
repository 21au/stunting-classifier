import { motion } from 'framer-motion'
import { Stethoscope } from 'lucide-react'

export default function AppHeader() {
  return (
    <div className="bg-white border-b border-sage">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-teal/10 p-2 rounded-lg text-teal">
            <Stethoscope size={20} />
          </div>
          <div>
            <p className="font-display font-semibold text-ink leading-none">Stunting Risk Classifier</p>
            <p className="text-xs text-muted mt-0.5">Alat bantu skrining status gizi balita</p>
          </div>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-mono bg-teal/10 text-teal px-2.5 py-1 rounded-full"
        >
          Untuk tenaga kesehatan
        </motion.span>
      </div>
    </div>
  )
}