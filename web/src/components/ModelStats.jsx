import { motion } from 'framer-motion'
import { ShieldCheck, TrendingUp, Database } from 'lucide-react'

export default function ModelStats() {
  const stats = [
    { icon: <ShieldCheck size={18} />, label: 'Akurasi Model', value: '99.9%' },
    { icon: <Database size={18} />, label: 'Data Latih', value: '120,999' },
    { icon: <TrendingUp size={18} />, label: 'Macro F1-Score', value: '0.999' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white border border-sage rounded-xl p-4 text-center"
        >
          <div className="flex justify-center text-teal mb-2">{s.icon}</div>
          <p className="font-display text-xl font-semibold">{s.value}</p>
          <p className="text-xs text-muted mt-1">{s.label}</p>
        </motion.div>
      ))}
    </div>
  )
}