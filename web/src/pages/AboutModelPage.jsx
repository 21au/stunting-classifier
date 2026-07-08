import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, MapPin, Calendar, FlaskConical, BarChart3, 
  CheckCircle2, Cpu, ShieldAlert, ChevronRight, Activity 
} from 'lucide-react';

const algorithms = [
  { name: 'Random Forest', accuracy: 95.2, f1Stunting: 94.8, f1Underweight: 95.1, f1Wasting: 92.3, status: 'Dipilih', highlight: true },
  { name: 'XGBoost', accuracy: 94.7, f1Stunting: 94.1, f1Underweight: 94.8, f1Wasting: 91.9, status: 'Runner-up', highlight: false },
  { name: 'LightGBM', accuracy: 94.1, f1Stunting: 93.4, f1Underweight: 94.3, f1Wasting: 91.2, status: 'Kandidat', highlight: false },
  { name: 'SVM (RBF)', accuracy: 91.3, f1Stunting: 90.9, f1Underweight: 91.7, f1Wasting: 88.4, status: 'Baseline', highlight: false },
  { name: 'Logistic Regression', accuracy: 88.6, f1Stunting: 87.5, f1Underweight: 89.1, f1Wasting: 84.2, status: 'Baseline', highlight: false },
];

const perIndicator = [
  { indicator: 'Stunting (HAZ)', precision: 94.1, recall: 95.5, f1: 94.8, auc: 98.2 },
  { indicator: 'Underweight (WAZ)', precision: 95.8, recall: 94.4, f1: 95.1, auc: 98.7 },
  { indicator: 'Wasting (WHZ)', precision: 91.7, recall: 92.9, f1: 92.3, auc: 97.1 },
];

const limitations = [
  { id: 'data', title: 'Data Tidak Merata', desc: 'Dataset memiliki proporsi kelas tidak seimbang (imbalanced) — kasus berat lebih sedikit. Upsampling SMOTE digunakan, namun performa pada kasus berat mungkin lebih rendah.' },
  { id: 'geo', title: 'Konteks Geografis', desc: 'Model dilatih pada data posyandu Jawa Tengah dan Jawa Barat. Performa mungkin bervariasi untuk populasi dengan karakteristik sosiodemografi berbeda.' },
  { id: 'time', title: 'Data Cross-Sectional', desc: 'Model menggunakan satu titik pengukuran. Tren longitudinal (pertumbuhan dari waktu ke waktu) tidak ditangkap oleh prediksi tunggal.' },
  { id: 'clinic', title: 'Bukan Diagnosis Klinis', desc: 'Output model berupa probabilitas kelas, bukan diagnosis definitif. Konfirmasi klinis tetap wajib oleh tenaga kesehatan terlatih.' },
];

const pipeline = [
  { step: '01', label: 'Pengumpulan Data', detail: 'Data antropometri dari 47.382 balita usia 0–60 bulan. Sumber: rekam medis posyandu dan puskesmas, 2019–2023.' },
  { step: '02', label: 'Preprocessing', detail: 'Normalisasi Z-score per referensi WHO 2006, imputasi missing values (KNN), deteksi outlier (IQR), label encoding.' },
  { step: '03', label: 'Feature Engineering', detail: '12 fitur: usia, jenis kelamin, BB, TB, LILA, HAZ, WAZ, WHZ, usia ibu, paritas, ASI eksklusif, wilayah.' },
  { step: '04', label: 'Pelatihan Model', detail: 'Random Forest (500 trees, max_depth=12, class_weight=balanced). 5-fold stratified cross-validation.' },
  { step: '05', label: 'Evaluasi', detail: 'Metrik: accuracy, precision, recall, F1-score per kelas, AUC-ROC. Test set: 20% data (stratified split).' },
];

// Helper component untuk memetakan ikon keterbatasan model
const LimitationIcon = ({ id }) => {
  const baseClass = "text-orange-500 shrink-0";
  if (id === 'data') return <AlertTriangle className={baseClass} size={24} />;
  if (id === 'geo') return <MapPin className={baseClass} size={24} />;
  if (id === 'time') return <Calendar className={baseClass} size={24} />;
  return <FlaskConical className={baseClass} size={24} />;
};

export default function TentangModel() {
  // Stagger animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 22 } }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      <motion.div 
        initial="hidden"
        animate="show"
        variants={containerVars}
        className="max-w-6xl mx-auto px-4 pt-20"
      >
        
        {/* Header */}
        <motion.div variants={itemVars} className="mb-14 text-center md:text-left">
          <span className="text-teal-700 text-sm font-bold uppercase tracking-widest mb-2 block">
            Dokumentasi Teknis
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif mb-4">
            Tentang Model Utama
          </h1>
          <p className="text-slate-500 max-w-xl text-base leading-relaxed">
            Metodologi, arsitektur, dan metrik performa model machine learning yang mendasari sistem prediksi kecukupan gizi anak.
          </p>
        </motion.div>

        {/* Pipeline Pengembangan */}
        <motion.section variants={itemVars} className="mb-16 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2.5">
            <Cpu className="text-teal-600" size={24} /> Pipeline Arsitektur Sistem
          </h2>
          <div className="flex flex-col">
            {pipeline.map((p, i) => (
              <div key={p.step} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-mono text-sm font-bold shrink-0 shadow-sm shadow-teal-600/10">
                    {p.step}
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[40px] bg-slate-200/80 my-1" />
                  )}
                </div>
                <div className={`${i < pipeline.length - 1 ? 'pb-8' : ''} pt-1.5`}>
                  <h4 className="text-base font-bold text-slate-800 mb-1">{p.label}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Perbandingan Algoritma */}
        <motion.section variants={itemVars} className="mb-16">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-1">
              <BarChart3 className="text-teal-600" size={24} /> Perbandingan Algoritma
            </h2>
            <p className="text-sm text-slate-500">
              Evaluasi validasi silang (5-fold cross-validation) pada dataset uji (n = 9.476 subjek)
            </p>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600 min-w-[700px]">
                <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Algoritma</th>
                    <th className="px-6 py-4">Akurasi Global</th>
                    <th className="px-6 py-4">F1 Stunting</th>
                    <th className="px-6 py-4">F1 Underweight</th>
                    <th className="px-6 py-4">F1 Wasting</th>
                    <th className="px-6 py-4">Status Seleksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {algorithms.map((alg, i) => (
                    <tr 
                      key={alg.name} 
                      className={`transition-colors ${alg.highlight ? 'bg-teal-50/40 hover:bg-teal-50/60' : i % 2 === 0 ? 'bg-white hover:bg-slate-50/50' : 'bg-slate-50/20 hover:bg-slate-50/50'}`}
                    >
                      <td className="px-6 py-4.5 font-bold text-slate-900 flex items-center gap-2">
                        {alg.name}
                        {alg.highlight && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            ★ Produksi
                          </span>
                        )}
                      </td>
                      {[alg.accuracy, alg.f1Stunting, alg.f1Underweight, alg.f1Wasting].map((val, j) => (
                        <td key={j} className="px-6 py-4.5 font-mono text-sm">
                          <span className={alg.highlight ? 'text-teal-700 font-bold' : 'text-slate-800'}>
                            {val.toFixed(1)}%
                          </span>
                        </td>
                      ))}
                      <td className="px-6 py-4.5">
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                          alg.highlight 
                            ? 'bg-teal-100/60 text-teal-800 border-teal-200' 
                            : alg.status === 'Runner-up' ? 'bg-amber-100/50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {alg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Metrik per Indikator */}
        <motion.section variants={itemVars} className="mb-16">
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
            <Activity className="text-teal-600" size={24} /> Metrik Validasi per Klasifikasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perIndicator.map((ind) => (
              <div 
                key={ind.indicator}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-teal-500" size={18} /> {ind.indicator}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Precision', value: ind.precision },
                    { label: 'Recall', value: ind.recall },
                    { label: 'F1-Score', value: ind.f1 },
                    { label: 'AUC-ROC', value: ind.auc },
                  ].map((m) => (
                    <div key={m.label} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{m.label}</div>
                      <div className="font-mono text-lg font-bold text-teal-700">{m.value.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Keterbatasan Model */}
        <motion.section variants={itemVars}>
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
            <ShieldAlert className="text-teal-600" size={24} /> Batasan & Regulasi Model
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {limitations.map((lim) => (
              <div 
                key={lim.title}
                className="bg-white rounded-3xl p-6 border border-slate-200 border-l-4 border-l-orange-500 shadow-sm flex gap-4 items-start"
              >
                <div className="bg-orange-50 p-2.5 rounded-2xl">
                  <LimitationIcon id={lim.id} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1.5">{lim.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{lim.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}