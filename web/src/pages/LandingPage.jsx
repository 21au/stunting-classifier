import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Activity, 
  CheckCircle2, 
  BrainCircuit, 
  Baby, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';

const infoCards = [
  {
    icon: <Baby size={24} className="text-teal-600" />,
    title: 'Stunting (Pendek)',
    tag: 'HAZ < -2 SD',
    simpleDesc: 'Kondisi di mana tinggi badan anak lebih pendek dari standar usianya akibat kekurangan gizi kronis (jangka panjang).',
    dangerZone: 'Dampak: Mengganggu perkembangan otak dan menurunkan kekebalan tubuh anak.',
    prevalence: 'Fakta: Dialami oleh 1 dari 5 balita Indonesia.',
    theme: {
      border: 'border-teal-200',
      tagBg: 'bg-teal-50 text-teal-700',
      text: 'text-teal-700',
      hover: 'hover:border-teal-400 hover:shadow-teal-100/50',
    },
  },
  {
    icon: <AlertCircle size={24} className="text-amber-500" />,
    title: 'Underweight (Berat Kurang)',
    tag: 'WAZ < -2 SD',
    simpleDesc: 'Kondisi di mana berat badan anak berada di bawah normal untuk usianya. Menandakan kurangnya asupan nutrisi harian.',
    dangerZone: 'Dampak: Menjadi pintu masuk utama menuju kondisi stunting jika tidak segera ditangani.',
    prevalence: 'Fakta: Memengaruhi sekitar 17,7% balita di Indonesia.',
    theme: {
      border: 'border-amber-200',
      tagBg: 'bg-amber-50 text-amber-600',
      text: 'text-amber-600',
      hover: 'hover:border-amber-400 hover:shadow-amber-100/50',
    },
  },
  {
    icon: <Activity size={24} className="text-rose-500" />,
    title: 'Wasting (Kurus Akut)',
    tag: 'WHZ < -2 SD',
    simpleDesc: 'Kondisi penyusutan berat badan secara drastis dibandingkan tinggi badannya. Anak terlihat sangat kurus atau memiliki "gizi buruk".',
    dangerZone: 'Dampak: Kondisi darurat medis yang meningkatkan risiko kematian pada balita secara signifikan.',
    prevalence: 'Fakta: Menyerang 7,7% balita dan membutuhkan penanganan instan.',
    theme: {
      border: 'border-rose-200',
      tagBg: 'bg-rose-50 text-rose-600',
      text: 'text-rose-600',
      hover: 'hover:border-rose-400 hover:shadow-rose-100/50',
    },
  },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-[#FAFAFA] min-h-screen font-sans antialiased selection:bg-teal-500/20">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-r from-teal-300/10 to-emerald-300/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* ================= 1. HERO SECTION ================= */}
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 relative">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 bg-white border border-teal-200 text-teal-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 shadow-sm shadow-teal-50"
          >
            <Sparkles size={14} className="animate-pulse" /> AI-Powered Growth Screening
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl sm:text-6xl font-extrabold text-slate-950 leading-[1.15] font-serif tracking-tight"
          >
            Deteksi Dini Masalah Gizi Balita <br />
            Dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-emerald-600">Machine Learning</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.15 }}
            className="text-slate-500 mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-medium"
          >
            Jangan tunggu sampai gejala fisik terlihat terlambat. Lindungi masa depan buah hati melalui pemantauan digital berbasis kecerdasan buatan yang mengacu pada standar global WHO.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/cek" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 12px 30px -10px rgba(15,118,110,0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 size={18} /> Mulai Tes Gizi Anak
              </motion.button>
            </Link>
            
            <Link to="/metode" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                Pelajari Metode AI <ArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ================= 2. TRUST & QUICK STATS ================= */}
     <section className="bg-white border-y border-slate-200/60 py-10 my-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-slate-100">
            <div>
              <span className="block font-mono text-3xl sm:text-4xl font-extrabold text-teal-700">WHO</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-1">Standar Referensi</span>
            </div>
            <div>
              <span className="block font-mono text-3xl sm:text-4xl font-extrabold text-slate-900">88.1%</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-1">F1-Score Stunting</span>
            </div>
            <div>
              <span className="block font-mono text-3xl sm:text-4xl font-extrabold text-slate-900">3 Indikator</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-1">Skrining Sekaligus</span>
            </div>
            <div>
              <span className="block font-mono text-3xl sm:text-4xl font-extrabold text-emerald-600">100%</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-1">Gratis & Terbuka</span>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            Skor performa model: Stunting 88.1% · Underweight 67.3% · Wasting 66.7% (Macro F1-Score).
            Lihat detail di halaman <a href="/tentang-model" className="underline hover:text-teal-600">Tentang Model</a>.
          </p>
        </div>
      </section>

      {/* ================= 3. EDUCATIONAL CARDS SECTION ================= */}
      <div className="max-w-6xl mx-auto px-4 py-20 relative">
        <div className="max-w-2xl mb-12">
          <span className="text-teal-700 text-xs font-bold uppercase tracking-widest block mb-2">Panduan Literasi Gizi</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif">
            Mengenal 3 Ancaman Gizi Utama Pada Balita
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Pahami perbedaannya agar Anda bisa memberikan penanganan nutrisi yang tepat sasaran.
          </p>
        </div>

        {/* Cards Grid dengan Animasi Lucu & Interaktif */}
        {/* Cards Grid yang Tenang, Nyaman Dibaca, tapi Tetap Cantik Pas Disentuh */}
<div className="grid md:grid-cols-3 gap-8">
  {infoCards.map((c, i) => (
    <motion.div
      key={i}
      // 1. Animasi halus HANYA sekali saat halaman pertama dimuat (tidak bergerak terus-menerus)
      initial={{ opacity: 0, y: 15 }} 
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.05 * i }}
      
      // 2. Efek interaktif yang tenang: Hanya sedikit membesar dan mengganti warna garis tepi saat disentuh
      whileHover={{ 
        scale: 1.02, 
        borderColor: "#0f766e", // Berubah jadi warna teal gelap yang tegas
        boxShadow: "0 12px 25px -10px rgba(15, 118, 110, 0.08)"
      }}
      whileTap={{ scale: 0.99 }}
      
      className={`bg-white rounded-[32px] p-6 sm:p-8 border-2 ${c.theme.border} shadow-sm transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer`}
    >
      {/* Dekorasi background statis yang aman untuk mata */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-slate-50 rounded-full transition-colors duration-300 group-hover:bg-teal-50/40 -z-0" />

      <div className="relative z-10">
        {/* Kontainer Ikon */}
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-6 shadow-sm">
          {c.icon}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {c.title}
          </h3>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full tracking-wider border shrink-0 text-center ${c.theme.tagBg} ${c.theme.border} shadow-sm`}>
            {c.tag}
          </span>
        </div>
        
        {/* Teks utama dijamin diam total agar sangat mudah dieja dan dibaca */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4 font-medium">
          {c.simpleDesc}
        </p>

        {/* Kotak Dampak */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 mb-4 transition-colors duration-300 group-hover:bg-white group-hover:border-slate-200">
          <p className="text-xs font-bold text-slate-500 leading-relaxed flex items-start gap-1.5">
            <span>🚨</span>
            <span>{c.dangerZone}</span>
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 relative z-10">
        <p className={`text-xs font-extrabold tracking-wide uppercase flex items-center gap-1.5 ${c.theme.text}`}>
          <span>📊</span> {c.prevalence}
        </p>
      </div>
    </motion.div>
  ))}
</div>
      </div>

     {/* ================= 4. HOW IT WORKS (EDUCATIVE FLOW) ================= */}
<section className="bg-slate-950 text-white py-20 rounded-[40px] mx-4 my-8 relative overflow-hidden">
  
  {/* Dekorasi Cahaya AI di Latar Belakang */}
  <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
  <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

  <div className="max-w-5xl mx-auto px-6 relative z-10">
    <div className="text-center max-w-xl mx-auto mb-16">
      <span className="text-teal-400 text-xs font-bold uppercase tracking-widest block mb-2">Alur Kerja Sistem</span>
      <h2 className="text-3xl font-bold font-serif">Bagaimana AI Membantu Anda?</h2>
      <p className="text-sm text-slate-400 mt-2">Komputasi cerdas dibuat sangat sederhana untuk kenyamanan harian Anda.</p>
    </div>

    {/* Container Grid dengan Efek Stagger (Muncul Bergantian) */}
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2 // Memberikan jeda 0.2 detik antar langkah agar muncul berurutan
          }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center relative"
    >
      {[
        {
          num: "1",
          title: "Input Data Berkala",
          desc: "Masukkan umur, jenis kelamin, berat, serta tinggi badan balita dari KMS atau Posyandu."
        },
        {
          num: "2",
          title: "Analisis Algoritma Temporal",
          desc: "Machine Learning menghitung deviasi Z-score dan memetakan pola pertumbuhan masa lalu anak."
        },
        {
          num: "3",
          title: "Proyeksi Risiko Dini",
          desc: "Dapatkan status klasifikasi gizi instan dan grafik prediksi tren kesehatan anak ke depan."
        }
      ].map((step, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: 30 },
            visible: { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { type: "spring", stiffness: 120, damping: 14 } 
            }
          }}
          whileHover={{ y: -8 }} // Sedikit terangkat saat kursor menyentuh langkah ini
          className="flex flex-col items-center group cursor-pointer"
        >
          {/* Efek Lingkaran Nomor Berpendar */}
          <motion.div 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(20, 184, 166, 0.2)" }}
            className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 font-mono font-black flex items-center justify-center text-xl mb-5 border border-teal-500/20 transition-all duration-300 shadow-md shadow-teal-500/5 group-hover:border-teal-400 group-hover:text-white"
          >
            {step.num}
          </motion.div>
          
          <h4 className="font-bold text-base text-white mb-2 transition-colors duration-300 group-hover:text-teal-400">
            {step.title}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs transition-colors duration-300 group-hover:text-slate-300">
            {step.desc}
          </p>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

      {/* ================= 5. KNOWLEDGE & FAQ BASE (BUNDA'S SMART CORNER) ================= */}
      <section className="max-w-3xl mx-auto px-4 py-20 relative">
        <div className="text-center mb-12">
          <motion.span 
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm"
          >
            ✨ Pojok Pintar Bunda
          </motion.span>
          <h3 className="text-3xl font-bold font-serif text-slate-950">
            Edukasi Seru Seputar Gizi Si Kecil
          </h3>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Klik pada pertanyaan di bawah untuk membuka rahasia tumbuh kembang anak yang optimal!
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              emoji: "🥛",
              question: "Mitos atau Fakta: Anak bertubuh pendek itu sudah pasti stunting?",
              badge: "Mitos vs Fakta",
              badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
              answer: "Mitos ya Bunda! ❌ Anak berbadan mungil bisa jadi karena faktor genetik ayah atau bunda yang juga imut namun tetap sehat dan aktif. Nah, kalau stunting itu pertumbuhannya terhenti karena kekurangan gizi dalam waktu lama dan sering sakit-sakitan.",
              tips: "Tips Pintar: Jangan panik duluan, Bun! Yang penting pantau grafik kecepatan tumbuhnya tiap bulan, bukan cuma dibanding-bandingkan dengan anak tetangga ya."
            },
            {
              emoji: "🥦",
              question: "Menu MPASI bergizi tinggi itu harus mahal dan pakai bahan impor?",
              badge: "Tips Menu Gizi",
              badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
              answer: "Sama sekali tidak, Bunda sayang! 🥬 Bahan pangan lokal di sekitar kita justru juara gizinya. Tahu gak sih, ikan kembung lokal ternyata punya kandungan Omega-3 yang tidak kalah tinggi jika dibandingkan dengan ikan salmon impor yang mahal!",
              tips: "Tips Pintar: Sediakan telur, tahu, tempe, dan hati ayam. Murah meriah, gampang didapat, dan sangat efektif untuk mencegah stunting."
            },
            {
              emoji: "🤖",
              question: "Gimana sih cara cerdas Machine Learning mendeteksi gizi anak?",
              badge: "Teknologi AI",
              badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
              answer: "Bayangkan AI ini seperti asisten digital pribadi Bunda. Kalau di buku KMS manual kita cuma coret-coret titik, Machine Learning kami bisa menganalisis tren naik-turun berat badan si kecil dari bulan lalu dan memprediksi kondisinya ke depan secara otomatis.",
              tips: "Tips Pintar: Semakin rutin Bunda memasukkan data timbangan si kecil ke aplikasi ini setiap bulan, prediksi AI-nya akan menjadi jauh lebih akurat!"
            }
          ].map((item, idx) => {
            const [isOpen, setIsOpen] = useState(false);

            return (
              <motion.div 
                key={idx}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-teal-400 shadow-md shadow-teal-100/40' : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-100 block shrink-0">{item.emoji}</span>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-md inline-block mb-1.5 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      <h4 className="font-bold text-slate-950 text-base sm:text-lg leading-snug">
                        {item.question}
                      </h4>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-slate-400 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                        <p className="text-slate-600 text-sm leading-relaxed font-medium mb-4">
                          {item.answer}
                        </p>
                        
                        <div className="p-4 bg-teal-50/60 border border-teal-100 rounded-2xl flex gap-3 items-start">
                          <span className="text-lg">💡</span>
                          <p className="text-xs font-bold text-teal-800 leading-relaxed">
                            {item.tips}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= 6. FINAL MEDICAL DISCLAIMER ================= */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="bg-teal-50/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-5 border border-teal-100/80 shadow-sm"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center border border-teal-200">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-900 block font-serif text-base mb-1">Catatan Penting Untuk Orang Tua & Kader</strong>
            Aplikasi skrining berbasis kecerdasan buatan ini ditujukan untuk memberikan <strong className="text-slate-900">deteksi dan alarm dini</strong> indikasi malnutrisi anak. Hasil kalkulasi sistem bersifat sebagai sistem pendukung keputusan (*decision support system*) edukatif dan <strong className="text-teal-700 font-semibold">tidak menggantikan keputusan atau pemeriksaan klinis akhir</strong> dokter spesialis anak atau ahli gizi profesional.
          </div>
        </motion.div>
      </div>

    </div>
  );
}