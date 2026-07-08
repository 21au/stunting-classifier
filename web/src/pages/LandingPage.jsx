import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Ruler, Scale, Activity as ActivityIcon, Sparkles } from 'lucide-react'

const infoCards = [
  { icon: <Ruler size={22} />, title: 'Stunting', desc: 'Tinggi badan anak lebih rendah dari standar usianya, tanda kekurangan gizi jangka panjang.' },
  { icon: <Scale size={22} />, title: 'Underweight', desc: 'Berat badan anak lebih rendah dari standar usianya.' },
  { icon: <ActivityIcon size={22} />, title: 'Wasting', desc: 'Berat badan tidak proporsional dengan tinggi badan, tanda kekurangan gizi akut.' },
]

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute top-16 right-[8%] text-teal/20 float-animation hidden md:block"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
      >
        <Ruler size={64} strokeWidth={1} />
      </motion.div>
      <motion.div
        className="absolute top-48 right-[20%] text-coral/20 float-animation hidden md:block"
        style={{ animationDelay: '1s' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
      >
        <Scale size={48} strokeWidth={1} />
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 bg-teal/10 text-teal text-xs font-mono px-3 py-1.5 rounded-full mb-4"
        >
          <Sparkles size={13} /> AI-Powered Growth Screening
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl font-semibold text-ink leading-[1.1] max-w-2xl"
        >
          Deteksi Dini Masalah Gizi Balita dengan Machine Learning
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="text-muted mt-5 max-w-xl text-lg leading-relaxed"
        >
          Stunting masih menjadi masalah kesehatan utama di Indonesia. Sistem ini membantu
          skrining awal status gizi balita — stunting, underweight, dan wasting — berdasarkan
          standar WHO, lengkap dengan penjelasan yang transparan.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Link to="/cek">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 10px 30px -10px rgba(15,118,110,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 bg-teal text-white px-7 py-3.5 rounded-xl font-medium flex items-center gap-2 relative"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Mulai Cek Status Gizi <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 mt-16">
          {infoCards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + 0.12 * i, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="card card-hover p-5"
            >
              <div className="text-teal mb-2 bg-teal/10 w-10 h-10 rounded-lg flex items-center justify-center">{c.icon}</div>
              <h3 className="font-display font-semibold mb-1">{c.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-14 bg-sage/40 rounded-2xl p-6 text-sm text-muted border border-sage"
        >
          <strong className="text-ink">Catatan penting:</strong> alat ini adalah bantu skrining awal
          berbasis machine learning dan tidak menggantikan diagnosis tenaga medis profesional.
          Hasil prediksi sebaiknya ditindaklanjuti dengan konsultasi ke tenaga kesehatan.
        </motion.div>
      </div>
    </div>
  )
}