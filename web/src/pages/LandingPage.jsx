import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Ruler, Scale, Activity as ActivityIcon } from 'lucide-react'

const infoCards = [
  { icon: <Ruler size={22} />, title: 'Stunting', desc: 'Tinggi badan anak lebih rendah dari standar usianya, tanda kekurangan gizi jangka panjang.' },
  { icon: <Scale size={22} />, title: 'Underweight', desc: 'Berat badan anak lebih rendah dari standar usianya.' },
  { icon: <ActivityIcon size={22} />, title: 'Wasting', desc: 'Berat badan tidak proporsional dengan tinggi badan, tanda kekurangan gizi akut.' },
]

export default function LandingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="font-mono text-xs text-coral tracking-widest uppercase mb-3"
      >
        AI-Powered Growth Screening
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-tight max-w-2xl"
      >
        Deteksi Dini Masalah Gizi Balita dengan Machine Learning
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-muted mt-4 max-w-xl"
      >
        Stunting masih menjadi masalah kesehatan utama di Indonesia. Sistem ini membantu
        skrining awal status gizi balita — stunting, underweight, dan wasting — berdasarkan
        standar WHO, lengkap dengan penjelasan yang transparan.
      </motion.p>

      <Link to="/cek">
        <motion.button
          whileHover={{ scale: 1.03 }}
          className="mt-6 bg-teal text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
        >
          Mulai Cek Status Gizi <ArrowRight size={18} />
        </motion.button>
      </Link>

      <div className="grid sm:grid-cols-3 gap-4 mt-14">
        {infoCards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-white border border-sage rounded-xl p-5"
          >
            <div className="text-teal mb-2">{c.icon}</div>
            <h3 className="font-display font-semibold mb-1">{c.title}</h3>
            <p className="text-sm text-muted">{c.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 bg-sage/40 rounded-xl p-6 text-sm text-muted">
        <strong className="text-ink">Catatan penting:</strong> alat ini adalah bantu skrining awal
        berbasis machine learning dan tidak menggantikan diagnosis tenaga medis profesional.
        Hasil prediksi sebaiknya ditindaklanjuti dengan konsultasi ke tenaga kesehatan.
      </div>
    </div>
  )
}