import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Sparkles, Award, ArrowUpRight, HelpCircle } from 'lucide-react';

export default function HeightPredictorPage() {
  const [gender, setGender] = useState('laki-laki');
  const [fatherHeight, setFatherHeight] = useState(170);
  const [motherHeight, setMotherHeight] = useState(158);
  const [result, setResult] = useState(null);

  const calculateGeneticHeight = (e) => {
    e.preventDefault();
    const ayah = parseFloat(fatherHeight);
    const ibu = parseFloat(motherHeight);

    if (isNaN(ayah) || isNaN(ibu)) return;

    let tpgTarget = gender === 'laki-laki' ? ((ibu + 13) + ayah) / 2 : ((ayah - 13) + ibu) / 2;
    
    setResult({
      target: tpgTarget,
      min: tpgTarget - 8.5,
      max: tpgTarget + 8.5,
      ayah: ayah,
      ibu: ibu
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 text-slate-900">
      
      {/* HEADER UTAMA */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
          🦒 Penggaris Jerapah Interaktif Model IDAI
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-slate-950">
          Kalkulator Tinggi Genetik Anak
        </h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm font-medium">
          Gunakan slider interaktif untuk mengatur tinggi orang tua dan lihat simulasi penggaris tumbuh kembang si kecil.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* PANEL KIRI: INPUT SLIDER INTERAKTIF */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <form onSubmit={calculateGeneticHeight} className="space-y-6">
            
            {/* JENIS KELAMIN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Jenis Kelamin Anak
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('laki-laki')}
                  className={`py-3 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                    gender === 'laki-laki'
                      ? 'bg-teal-50 border-teal-500 text-teal-800 ring-2 ring-teal-500/10'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  👦 Laki-Laki
                </button>
                <button
                  type="button"
                  onClick={() => setGender('perempuan')}
                  className={`py-3 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                    gender === 'perempuan'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/10'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  👧 Perempuan
                </button>
              </div>
            </div>

            {/* SLIDER TINGGI AYAH */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  👨 Tinggi Badan Ayah
                </label>
                <span className="text-sm font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-xl text-slate-800">
                  {fatherHeight} cm
                </span>
              </div>
              <input
                type="range"
                min="140"
                max="210"
                value={fatherHeight}
                onChange={(e) => setFatherHeight(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* SLIDER TINGGI IBU */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  👩 Tinggi Badan Ibu
                </label>
                <span className="text-sm font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-xl text-slate-800">
                  {motherHeight} cm
                </span>
              </div>
              <input
                type="range"
                min="135"
                max="195"
                value={motherHeight}
                onChange={(e) => setMotherHeight(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* TOMBOL HITUNG */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-4 rounded-2xl transition-all cursor-pointer shadow-md text-sm tracking-wide mt-4"
            >
              Simulasikan Tinggi Jerapah 🚀
            </motion.button>
          </form>

          {/* CATATAN PENDUKUNG */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex gap-2.5 items-start text-[11px] text-slate-400 leading-relaxed">
            <HelpCircle size={14} className="shrink-0 text-slate-300 mt-0.5" />
            <span>Geser indikator slider di atas untuk mencocokkan postur tinggi biologis orang tua kandung.</span>
          </div>
        </div>

        {/* PANEL KANAN: GRAFIK PENGGARIS ANIMATIF */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-dashed border-slate-200 rounded-[32px] p-8 h-full flex flex-col items-center justify-center text-center text-slate-400 min-h-[400px]"
              >
                <Ruler size={40} className="text-slate-300 mb-2 animate-bounce" />
                <p className="text-sm font-semibold max-w-sm">
                  Klik tombol kuning di samping untuk meluncurkan animasi penggaris jerapah interaktif!
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-gradient-to-b from-amber-50/50 to-orange-50/20 border border-amber-200/60 rounded-[32px] p-6 sm:p-8 shadow-sm h-full grid grid-cols-1 md:grid-cols-12 gap-6 relative overflow-hidden"
              >
                {/* INFO DATA NUMERIK */}
                <div className="md:col-span-6 flex flex-col justify-between z-10">
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1 text-amber-800 font-bold text-xs bg-amber-100/80 px-2.5 py-1 rounded-xl">
                      <Sparkles size={12} /> Hasil Kalkulasi Genetik
                    </span>
                    
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Prediksi Tinggi Tengah</span>
                      <div className="flex items-baseline gap-1">
                        <h2 className="text-5xl font-black font-mono tracking-tight text-slate-950">{result.target}</h2>
                        <span className="text-sm font-bold text-slate-500">cm</span>
                      </div>
                    </div>

                    <div className="bg-white/80 border border-amber-100 rounded-2xl p-4 shadow-sm space-y-2.5">
                      <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                        <span>Zona Aman Minimum:</span>
                        <span className="font-mono font-bold text-slate-800">{result.min} cm</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-full rounded-full"></div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                        <span>Potensi Maksimum:</span>
                        <span className="font-mono font-bold text-slate-800">{result.max} cm</span>
                      </div>
                    </div>
                  </div>

                  {/* WEJANGAN MEDIS ANTI STUNTING */}
                  <div className="mt-6 bg-amber-50/80 p-3.5 border border-amber-200/50 rounded-2xl flex gap-2.5 items-start">
                    <Award size={16} className="text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                      <strong>Ingat Bun!</strong> Genetik menyumbang sekitar 30-40%. Maksimalkan sisa 60% tinggi badan si kecil lewat nutrisi gizi seimbang, tidur malam teratur, dan aktif bergerak.
                    </p>
                  </div>
                </div>

                {/* VISUALISASI PENGGARIS INTERAKTIF */}
                <div className="md:col-span-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-inner flex justify-center items-end relative h-[340px] md:h-full min-h-[320px]">
                  
                  {/* Skala Garis Penggaris (Sisi Kiri Dalam) */}
                  <div className="absolute left-4 top-4 bottom-4 w-4 border-r border-slate-200 flex flex-col justify-between text-[10px] font-mono text-slate-400 select-none">
                    <span>200cm</span><span>180cm</span><span>160cm</span><span>140cm</span><span>120cm</span>
                  </div>

                  {/* BATANG PENGGARIS UTAMA (ANIMATED GIRAFFE BAR) */}
                  <div className="w-16 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-2xl relative shadow-md group transition-all" style={{ height: `${(result.target / 200) * 100}%` }}>
                    
                    {/* Efek Totol Jerapah */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#7c2d12_20%,transparent_20%)] bg-[size:12px_12px] rounded-t-2xl"></div>

                    {/* ANIMASI BAR NAIK */}
                    <motion.div 
                      initial={{ height: "0%" }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-orange-500/20 to-transparent rounded-t-2xl"
                    />

                    {/* PENANDA 1: TARGET ANAK (Ujung Atas) */}
                    <div className="absolute -right-36 -top-2 bg-slate-950 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 z-20">
                      <ArrowUpRight size={10} className="text-amber-400" /> Anak: {result.target}cm
                    </div>

                    {/* PENANDA 2: TINGGI AYAH */}
                    <div 
                      className="absolute -right-28 border-b-2 border-dashed border-teal-500 text-teal-700 text-[9px] font-bold pr-2 whitespace-nowrap"
                      style={{ bottom: `${((result.ayah - result.target) / result.target) * 100 + 100}%` }}
                    >
                      👨 Ayah: {result.ayah}cm
                    </div>

                    {/* PENANDA 3: TINGGI IBU */}
                    <div 
                      className="absolute -right-28 border-b-2 border-dashed border-rose-500 text-rose-700 text-[9px] font-bold pr-2 whitespace-nowrap"
                      style={{ bottom: `${((result.ibu - result.target) / result.target) * 100 + 100}%` }}
                    >
                      👩 Ibu: {result.ibu}cm
                    </div>

                    {/* AREA RENTANG WARNA (TOLERANSI +-8.5cm) */}
                    <div 
                      className="absolute -left-12 right-0 bg-amber-400/20 border-y border-amber-500/40 backdrop-blur-[0.5px] z-0 flex items-center"
                      style={{ 
                        bottom: `${((result.min) / result.target) * 100 - 15}%`, 
                        height: `${(17 / result.target) * 100}%` 
                      }}
                    >
                      <span className="text-[8px] font-bold text-amber-800 -ml-1 bg-amber-100 px-1 rounded shadow-sm">Rentang TPG</span>
                    </div>

                  </div>

                  {/* KEPALA JERAPAH LUCU DI ATAS */}
                  <div className="absolute top-2 right-2 text-4xl select-none animate-bounce">
                    🦒
                  </div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}