import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Calculator, User, Stethoscope, Baby, Ruler, Scale, Info, Activity } from 'lucide-react';

// --- Helper Functions ---
function computeZScore(value, median, sd) {
  return Math.round(((value - median) / sd) * 100) / 100;
}

// Mengubah klasifikasi menjadi lebih mudah dipahami awam
function getStatus(z) {
  if (z >= -1) return 'Ideal';
  if (z >= -2) return 'Perlu Perhatian';
  if (z >= -3) return 'Waspada';
  return 'Butuh Penanganan';
}

function statusTheme(status) {
  if (status === 'Ideal') return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' };
  if (status === 'Perlu Perhatian') return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' };
  if (status === 'Waspada') return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
  return { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' };
}

// --- Mock Data Generators ---
function mockResults(form) {
  const usia = parseInt(form.usia) || 24;
  const berat = parseFloat(form.berat) || 10;
  const tinggi = parseFloat(form.tinggi) || 85;

  const medianHAZ = 85 + usia * 0.3;
  const medianWAZ = 9 + usia * 0.1;
  const medianWHZ = (berat / (tinggi / 100) ** 2) * 0.95;

  const haz = computeZScore(tinggi, medianHAZ, 3.5);
  const waz = computeZScore(berat, medianWAZ, 1.1);
  const whz = computeZScore(medianWHZ, 17, 2.5);

  const makeProbs = (z) => {
    const s = getStatus(z);
    const base = s === 'Ideal' ? [72, 18, 7, 3] : s === 'Perlu Perhatian' ? [20, 54, 18, 8] : s === 'Waspada' ? [8, 22, 52, 18] : [3, 8, 18, 71];
    return [
      { kelas: 'Ideal', prob: base[0], color: '#10B981' },
      { kelas: 'Perlu Perhatian', prob: base[1], color: '#F59E0B' },
      { kelas: 'Waspada', prob: base[2], color: '#F97316' },
      { kelas: 'Butuh Penanganan', prob: base[3], color: '#EF4444' },
    ];
  };

  return [
    {
      label: 'Stunting (Tinggi Badan menurut Usia)',
      zscore: haz,
      status: getStatus(haz),
      probabilities: makeProbs(haz),
      description: {
        parent: haz >= -2 
          ? 'Wah, hebat Bunda! Tinggi badan si Kecil saat ini sudah ideal dan sesuai dengan usianya. Pertumbuhan tulang dan tubuhnya berjalan sangat optimal. Terus pertahankan asupan gizi seimbangnya ya, Bun. Semangat terus mengawal tumbuh kembang si Kecil! 💕' 
          : 'Halo Bunda, dari hasil cek saat ini, tinggi badan si Kecil sepertinya masih sedikit di bawah standar usianya. Tapi jangan panik dulu ya, Bun! Yuk, jadikan ini pengingat buat pelan-pelan memperbaiki asupan gizinya, terutama protein hewani seperti telur, ayam, atau ikan. Jangan ragu buat konsultasi ke Posyandu atau dokter anak terdekat ya. Bunda pasti bisa, semangat! 💪',
        clinical: `HAZ: ${haz.toFixed(2)} SD. ${getStatus(haz) !== 'Ideal' ? 'Indikasi gangguan pertumbuhan linier (stunting). Perlu evaluasi asupan nutrisi makro dan mikro, serta riwayat infeksi berulang.' : 'Pertumbuhan linier dalam batas normal.'}`,
      },
    },
    {
      label: 'Underweight (Berat Badan menurut Usia)',
      zscore: waz,
      status: getStatus(waz),
      probabilities: makeProbs(waz),
      description: {
        parent: waz >= -2 
          ? 'Alhamdulillah, berat badan si Kecil terpantau sehat dan pas, Bun! Hebat banget Bunda sudah sabar memastikan nutrisi harian si Kecil terpenuhi. Yuk, lanjutkan terus rutinitas makan bergizi dan jangan lupa luangkan waktu buat istirahat biar Bunda juga bahagia! ✨' 
          : 'Bunda, berat badan si Kecil saat ini butuh perhatian ekstra nih karena masih di bawah rata-rata. Tenang, Bun, masa pertumbuhan masih panjang kok! Coba kita koreksi lagi menu makanannya, mungkin butuh tambahan kalori, protein, atau lemak tambahan (seperti santan, minyak sayur, atau mentega). Tetap semangat ya, Bun, setiap suapan dari tangan Bunda itu sangat berharga buat si Kecil! 🍲',
        clinical: `WAZ: ${waz.toFixed(2)} SD. ${getStatus(waz) !== 'Ideal' ? 'Kondisi underweight. Rekomendasikan konseling Pemberian Makan Bayi dan Anak (PMBA) serta monitoring berat badan mingguan.' : 'Berat badan sesuai dengan usia.'}`,
      },
    },
    {
      label: 'Wasting (Berat Badan menurut Tinggi Badan)',
      zscore: whz,
      status: getStatus(whz),
      probabilities: makeProbs(whz),
      description: {
        parent: whz >= -2 
          ? 'Kabar gembira buat Bunda! Proporsi berat dan tinggi badan si Kecil sangat pas dan seimbang. Kelihatan banget nih Bunda pasti telaten merawatnya. Terus pantau dan berikan pelukan hangat setiap hari buat si Kecil ya, Bun! 🥰' 
          : 'Bunda sayang, postur tubuh si Kecil saat ini terlihat agak kurus dibandingkan dengan tinggi badannya. Jangan sedih dan jangan khawatir berlebihan ya, Bun, kita cari solusinya sama-sama. Yuk, segera bawa si Kecil ke bidan, puskesmas, atau dokter terdekat supaya dapat saran gizi terbaik dari ahlinya. Bunda hebat, yuk semangat kejar berat badan ideal si Kecil! 👩‍⚕️❤️',
        clinical: `WHZ: ${whz.toFixed(2)} SD. ${getStatus(whz) === 'Butuh Penanganan' ? 'Indikasi SAM (Severe Acute Malnutrition) — rujuk segera untuk penanganan medis.' : getStatus(whz) !== 'Ideal' ? 'MAM/Wasting ringan — perlu intervensi gizi segera (Pemberian Makanan Tambahan).' : 'Proporsi tubuh ideal (normal).'}`,
      },
    },
  ];
}

function growthCurveData() {
  return Array.from({ length: 60 }, (_, i) => ({
    usia: i + 1,
    p3: 70 + i * 0.28,
    p15: 72 + i * 0.3,
    p50: 76 + i * 0.31,
    p85: 80 + i * 0.32,
    p97: 83 + i * 0.33,
  }));
}

// --- Sub-components ---
const ProgressBar = ({ prob, color }) => (
  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${prob}%` }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="h-full rounded-full"
      style={{ backgroundColor: color }}
    />
  </div>
);

// Toggle didesain ulang agar lebih menonjol
const Toggle = ({ value, onChange }) => (
  <div className="flex bg-slate-100 p-1.5 rounded-full shadow-inner border border-slate-200">
    <button
      type="button"
      onClick={() => onChange(false)}
      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
        !value 
          ? 'bg-white text-teal-700 shadow-md transform scale-105' 
          : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      Bahasa Sehari-hari
    </button>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
        value 
          ? 'bg-white text-amber-700 shadow-md transform scale-105' 
          : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      Bahasa Medis
    </button>
  </div>
);

// --- Main Component ---
export default function ClassifierPage() {
  const [form, setForm] = useState({ usia: '', kelamin: 'L', berat: '', tinggi: '' });
  const [results, setResults] = useState(null);
  const [clinicalMode, setClinicalMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const curveData = growthCurveData();
  const childPoint = submitted && results 
    ? [{ usia: parseInt(form.usia) || 24, height: parseFloat(form.tinggi) || 85 }] 
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setResults(mockResults(form));
    setSubmitted(true);
  };

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 25 } }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-20">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center md:text-left">
          <span className="text-teal-700 text-sm font-bold uppercase tracking-widest mb-2 block">
            Asisten Pintar Tumbuh Kembang
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif">
            Cek Status Gizi si Kecil
          </h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto md:mx-0">
            Masukkan data si Kecil di bawah ini, lalu biarkan sistem AI kami membantu Bunda membaca grafik pertumbuhannya dengan bahasa yang mudah dipahami.
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className={`grid gap-8 items-start transition-all duration-500 ${submitted ? 'lg:grid-cols-12' : 'max-w-xl mx-auto'}`}>
          
          {/* Form Section */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleSubmit}
            className={`bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm ${submitted ? 'lg:col-span-4 sticky top-6' : ''}`}
          >
            <h2 className="font-serif text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Baby size={22} className="text-teal-600" /> Masukkan Data si Kecil
            </h2>

            <div className="space-y-5">
              {/* Usia */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Usia Anak (Bulan)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={form.usia}
                    onChange={(e) => setForm({ ...form, usia: e.target.value })}
                    placeholder="Contoh: 24 (untuk 2 tahun)"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Kelamin */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Jenis Kelamin</label>
                <div className="flex gap-3">
                  {['L', 'P'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setForm({ ...form, kelamin: k })}
                      className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                        form.kelamin === k 
                          ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm' 
                          : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {k === 'L' ? '♂ Laki-laki (L)' : '♀ Perempuan (P)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Berat */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Berat Badan (Kilogram)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Scale size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.berat}
                    onChange={(e) => setForm({ ...form, berat: e.target.value })}
                    placeholder="Contoh: 10.5"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Tinggi */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Panjang/Tinggi Badan (Sentimeter)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ruler size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.tinggi}
                    onChange={(e) => setForm({ ...form, tinggi: e.target.value })}
                    placeholder="Contoh: 85"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-8 w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition-all"
            >
              <Calculator size={20} /> Cek Pertumbuhan Sekarang
            </motion.button>
          </motion.form>

          {/* Results Section */}
          <div className={`${submitted ? 'lg:col-span-8' : 'hidden'}`}>
            <AnimatePresence>
              {results && (
                <motion.div 
                  variants={containerVars} 
                  initial="hidden" 
                  animate="show" 
                  className="flex flex-col gap-6"
                >
                  {/* Toggle Mode Penjelasan */}
                  <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
                    <p className="text-sm text-slate-700 font-semibold">Tampilkan penjelasan dalam:</p>
                    <Toggle value={clinicalMode} onChange={setClinicalMode} />
                  </div>

                  {/* Indikator Cards */}
                  {results.map((res) => {
                    const theme = statusTheme(res.status);
                    return (
                      <motion.div
                        variants={itemVars}
                        key={res.label}
                        className={`bg-white rounded-3xl p-6 md:p-8 border-2 ${theme.border} shadow-sm relative overflow-hidden`}
                      >
                        {/* Status Badge */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                          <div>
                            <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900">{res.label}</h3>
                            <p className="text-xs text-slate-500 mt-1">Skor teknis (Z-score): {res.zscore > 0 ? '+' : ''}{res.zscore.toFixed(2)} SD</p>
                          </div>
                          <span className={`px-5 py-2 rounded-full text-sm font-bold border ${theme.bg} ${theme.text} ${theme.border}`}>
                            Kondisi: {res.status}
                          </span>
                        </div>

                        {/* Deskripsi Kesimpulan */}
                        <div className={`rounded-2xl p-5 mb-6 border-l-4 ${clinicalMode ? 'bg-amber-50 border-l-amber-500' : 'bg-teal-50 border-l-teal-500'}`}>
                          <div className="flex items-center gap-2 mb-3">
                            {clinicalMode ? <Stethoscope size={20} className="text-amber-600" /> : <Info size={20} className="text-teal-600" />}
                            <span className={`text-sm font-bold uppercase tracking-wider ${clinicalMode ? 'text-amber-800' : 'text-teal-800'}`}>
                              {clinicalMode ? 'Analisis Klinis (Untuk Nakes)' : 'Saran & Semangat Buat Bunda'}
                            </span>
                          </div>
                          <p className="text-[15px] text-slate-700 leading-relaxed font-medium">
                            {clinicalMode ? res.description.clinical : res.description.parent}
                          </p>
                        </div>

                        {/* Probabilitas Grid */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                            Prediksi Sistem untuk Kondisi si Kecil
                          </p>
                          <div className="space-y-4">
                            {res.probabilities.map((p) => (
                              <div key={p.kelas} className="flex items-center gap-4">
                                <span className="w-32 text-sm text-slate-600 font-semibold">{p.kelas}</span>
                                <ProgressBar prob={p.prob} color={p.color} />
                                <span className="w-12 text-right text-sm font-bold text-slate-700">{p.prob}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Kurva Pertumbuhan */}
                  <motion.div variants={itemVars} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity size={24} className="text-teal-600" />
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900">Kurva Pertumbuhan WHO</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-8">Grafik tinggi badan si Kecil dibandingkan dengan standar usia.</p>
                    
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={curveData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="usia" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis domain={[60, 120]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            labelFormatter={(v) => `Usia: ${v} bulan`}
                          />
                          <Line type="monotone" dataKey="p97" stroke="#cbd5e1" dot={false} strokeWidth={1.5} name="Sangat Tinggi" />
                          <Line type="monotone" dataKey="p85" stroke="#5eead4" dot={false} strokeWidth={2} name="Tinggi" />
                          <Line type="monotone" dataKey="p50" stroke="#0d9488" dot={false} strokeWidth={3} name="Ideal (Median)" />
                          <Line type="monotone" dataKey="p15" stroke="#fcd34d" dot={false} strokeWidth={2} name="Batas Bawah Ideal" />
                          <Line type="monotone" dataKey="p3" stroke="#fca5a5" dot={false} strokeWidth={1.5} name="Kurang (Waspada)" />
                          
                          {childPoint.length > 0 && (
                            <ReferenceLine x={childPoint[0].usia} stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" />
                          )}
                          {childPoint.length > 0 && (
                            <ReferenceLine 
                              y={childPoint[0].height} 
                              stroke="#f43f5e" 
                              strokeWidth={2}
                              strokeDasharray="3 3" 
                              label={{ value: `Posisi si Kecil (${childPoint[0].height}cm)`, position: 'insideTopLeft', fill: '#be123c', fontSize: 13, fontWeight: 'bold' }} 
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}