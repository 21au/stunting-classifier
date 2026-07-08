import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, SearchX, Tag } from 'lucide-react';

const terms = [
  {
    term: 'HAZ',
    full: 'Height-for-Age Z-score',
    category: 'Indikator',
    desc: 'Z-score tinggi badan terhadap usia. Mengukur pertumbuhan linier jangka panjang. HAZ < -2 SD menandakan stunting; HAZ < -3 SD menandakan stunting berat.',
  },
  {
    term: 'WAZ',
    full: 'Weight-for-Age Z-score',
    category: 'Indikator',
    desc: 'Z-score berat badan terhadap usia. Menggambarkan status gizi umum. WAZ < -2 SD menandakan underweight; WAZ < -3 SD menandakan severely underweight.',
  },
  {
    term: 'WHZ',
    full: 'Weight-for-Height Z-score',
    category: 'Indikator',
    desc: 'Z-score berat badan terhadap tinggi badan. Indikator kekurusan akut. WHZ < -2 SD menandakan wasting; WHZ < -3 SD menandakan wasting berat.',
  },
  {
    term: 'Z-score',
    full: 'Standard Deviation Score',
    category: 'Statistik',
    desc: 'Ukuran standar yang menyatakan seberapa jauh nilai seorang anak dari nilai median populasi referensi WHO, dalam satuan standar deviasi (SD).',
  },
  {
    term: 'SAM',
    full: 'Severe Acute Malnutrition',
    category: 'Diagnosis',
    desc: 'Kekurangan gizi akut berat: WHZ < -3 SD atau MUAC < 115 mm atau adanya edema nutrisi. Memerlukan penanganan terapeutik segera di fasilitas kesehatan.',
  },
  {
    term: 'MAM',
    full: 'Moderate Acute Malnutrition',
    category: 'Diagnosis',
    desc: 'Kekurangan gizi akut sedang: WHZ antara -3 dan -2 SD atau MUAC 115–125 mm. Ditangani dengan program pemberian makanan tambahan berbasis komunitas.',
  },
  {
    term: 'Stunting',
    full: 'Gagal Tumbuh Linier',
    category: 'Kondisi',
    desc: 'Kondisi ketika tinggi badan anak lebih pendek dari yang seharusnya untuk usianya (HAZ < -2 SD) akibat kekurangan gizi kronis dan infeksi berulang.',
  },
  {
    term: 'Wasting',
    full: 'Kekurusan Akut',
    category: 'Kondisi',
    desc: 'Kondisi berat badan sangat rendah terhadap tinggi badan (WHZ < -2 SD). Merupakan bentuk malnutrisi akut yang sering berhubungan dengan penyakit atau kelaparan.',
  },
  {
    term: 'Underweight',
    full: 'Berat Badan Kurang',
    category: 'Kondisi',
    desc: 'Berat badan rendah terhadap usia (WAZ < -2 SD). Dapat mencerminkan stunting, wasting, atau kombinasi keduanya pada seorang anak.',
  },
  {
    term: 'MUAC',
    full: 'Mid-Upper Arm Circumference',
    category: 'Pengukuran',
    desc: 'Lingkar lengan atas tengah. Pengukuran cepat status gizi yang sering digunakan di lapangan. MUAC < 125 mm pada anak 6–59 bulan menandakan MAM atau SAM.',
  },
  {
    term: 'PMBA',
    full: 'Pemberian Makan Bayi dan Anak',
    category: 'Intervensi',
    desc: 'Panduan WHO/UNICEF tentang praktik optimal pemberian makan: ASI eksklusif 6 bulan, MPASI tepat waktu dan berkualitas, ASI lanjutan hingga 2 tahun.',
  },
  {
    term: 'RUTF',
    full: 'Ready-to-Use Therapeutic Food',
    category: 'Intervensi',
    desc: 'Makanan terapeutik siap pakai berbasis kacang tanah, susu, gula, dan minyak. Digunakan untuk penanganan SAM rawat jalan pada anak 6–59 bulan.',
  },
];

const categories = ['Semua', 'Indikator', 'Statistik', 'Diagnosis', 'Kondisi', 'Pengukuran', 'Intervensi'];

// Mapping warna kategori menggunakan standar Tailwind utility class
const categoryStyles = {
  Indikator: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Statistik: 'bg-blue-50 text-blue-700 border-blue-200',
  Diagnosis: 'bg-amber-50 text-amber-700 border-amber-200',
  Kondisi: 'bg-rose-50 text-rose-700 border-rose-200',
  Pengukuran: 'bg-purple-50 text-purple-700 border-purple-200',
  Intervensi: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function PanduanIstilah() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  const filtered = terms.filter((t) => {
    const matchCat = activeCategory === 'Semua' || t.category === activeCategory;
    const matchSearch =
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.full.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-20">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-teal-700 text-sm font-bold uppercase tracking-widest mb-2 block">
            Referensi Resmi
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif mb-4 flex items-center justify-center md:justify-start gap-3">
            <BookOpen className="text-teal-600 hidden md:block" size={36} /> Panduan Istilah Gizi
          </h1>
          <p className="text-slate-500 max-w-xl text-base leading-relaxed">
            Glosarium istilah medis, indikator statistik, dan ragam intervensi klinis yang digunakan dalam sistem skrining gizi balita.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-10 flex flex-col gap-5 lg:flex-row lg:items-center justify-between">
          
          {/* Input Pencarian */}
          <div className="relative flex-1 max-w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari istilah, kepanjangan, atau definisi..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-600/5 transition-all duration-200"
            />
          </div>

          {/* Filter Kategori */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline-block">
              Filter:
            </span>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/10'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Kartu Istilah */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((t) => {
              const badgeStyle = categoryStyles[t.category] || 'bg-slate-50 text-slate-500 border-slate-200';
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  key={t.term}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Item */}
                    <div className="flex justify-between items-start gap-4 mb-3.5">
                      <code className="font-mono text-2xl font-bold text-teal-700 tracking-tight">
                        {t.term}
                      </code>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider shrink-0 ${badgeStyle}`}>
                        <Tag size={10} /> {t.category}
                      </span>
                    </div>

                    {/* Kepanjangan / Subtitle */}
                    <div className="text-xs font-bold text-slate-400 italic mb-3">
                      {t.full}
                    </div>

                    {/* Deskripsi */}
                    <p className="text-sm leading-relaxed text-slate-600">
                      {t.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl shadow-sm"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <SearchX size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Tidak ada istilah yang sesuai</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Kata kunci <span className="font-semibold text-slate-600">"{search}"</span> tidak ditemukan pada kategori <span className="font-semibold text-slate-600">"{activeCategory}"</span>.
            </p>
          </motion.div>
        )}
        
      </div>
    </div>
  );
}