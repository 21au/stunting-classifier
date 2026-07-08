import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Baby, CheckCircle2, ShieldAlert, Clock, BookOpen } from 'lucide-react';

// DATA RESMI JADWAL IMUNISASI WAJIB (Berdasarkan Buku KIA Kemenkes RI & IDAI)
const IMMUNIZATION_DATA = [
  { id: 1, ageMonths: 0, name: "Hepatitis B (HB-O)", desc: "Mencegah penularan virus Hepatitis B dari ibu ke bayi saat proses kelahiran.", type: "Wajib" },
  { id: 2, ageMonths: 1, name: "BCG & Polio 1", desc: "BCG mencegah TBC paru/selaput otak berat. Polio 1 mencegah kelumpuhan.", type: "Wajib" },
  { id: 3, ageMonths: 2, name: "DPT-HB-Hib 1 & Polio 2", desc: "Mencegah Difteri, Pertusis (Batuk Rejan), Tetanus, Hepatitis B, serta Meningitis/Pneumonia.", type: "Wajib" },
  { id: 4, ageMonths: 3, name: "DPT-HB-Hib 2 & Polio 3", desc: "Imunisasi lanjutan dosis kedua untuk memperkuat kekebalan tubuh si kecil.", type: "Wajib" },
  { id: 5, ageMonths: 4, name: "DPT-HB-Hib 3, Polio 4 & IPV (Polio Suntik)", desc: "Perlindungan maksimal fase pertama dari kelumpuhan polio dan infeksi bakteri.", type: "Wajib" },
  { id: 6, ageMonths: 9, name: "Campak-Rubela (MR) 1", desc: "Mencegah penyakit campak berat yang memicu radang paru, radang otak, dan kebutaan.", type: "Wajib" },
  { id: 7, ageMonths: 18, name: "DPT-HB-Hib Booster", desc: "Dosis penguat (booster) agar kekebalan tubuh anak bertahan jangka panjang.", type: "Wajib" },
  { id: 8, ageMonths: 18, name: "Campak-Rubela (MR) Booster", desc: "Dosis penguat untuk memastikan anak kebal dari bahaya sindrom rubela.", type: "Wajib" }
];

export default function ImmunizationSchedulePage() {
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [checkedList, setCheckedList] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [currentAgeMonths, setCurrentAgeMonths] = useState(0);

  // Fungsi menghitung selisih bulan dari tanggal lahir
  const handleCalculateSchedule = (e) => {
    e.preventDefault();
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();

    const yearsDiff = today.getFullYear() - birth.getFullYear();
    const monthsDiff = today.getMonth() - birth.getMonth();
    const totalMonths = (yearsDiff * 12) + monthsDiff;

    setCurrentAgeMonths(totalMonths >= 0 ? totalMonths : 0);
    setIsGenerated(true);
  };

  // Fungsi toggle checklist imunisasi yang sudah disuntik
  const toggleCheck = (id) => {
    if (checkedList.includes(id)) {
      setCheckedList(checkedList.filter(item => item !== id));
    } else {
      setCheckedList([...checkedList, id]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-slate-900">
      {/* HEADER UTAMA */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
          📚 Rujukan Resmi Buku KIA & IDAI
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-slate-950">
          Kalender Imunisasi Pintar
        </h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm font-medium">
          Pantau jadwal imunisasi wajib nasional si kecil secara otomatis agar tumbuh kembangnya bebas dari ancaman penyakit berbahaya.
        </p>
      </div>

      {/* RUMAH FORM DATA ANAK */}
      <motion.div 
        layout
        className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-sm max-w-xl mx-auto mb-12"
      >
        <form onSubmit={handleCalculateSchedule} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Baby size={14} className="text-rose-500" /> Nama Si Kecil
              </label>
              <input 
                type="text" 
                placeholder="Misal: Dedek Arka"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-2xl px-4 py-3 text-sm font-medium transition-all focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar size={14} className="text-teal-500" /> Tanggal Lahir
              </label>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-2xl px-4 py-3 text-sm font-medium transition-all focus:outline-none"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 rounded-2xl transition-all cursor-pointer shadow-md shadow-teal-700/10 text-sm"
          >
            Lihat Jadwal Imunisasi {babyName ? `Si ${babyName}` : ''} ✨
          </motion.button>
        </form>
      </motion.div>

      {/* DAFTAR JADWAL IMUNISASI OTOMATIS */}
      <AnimatePresence>
        {isGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Info Usia Saat Ini */}
            <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold">Kartu Pantau Imunisasi: {babyName || "Si Kecil"}</h3>
                <p className="text-xs text-teal-100 mt-1 font-medium flex items-center gap-1">
                  <Clock size={12} /> Usia saat ini: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-white font-bold">{currentAgeMonths} Bulan</span>
                </p>
              </div>
              <div className="text-xs font-bold bg-white/10 border border-white/20 rounded-2xl px-4 py-2">
                Sudah Terlaksana: {checkedList.length} dari {IMMUNIZATION_DATA.length}
              </div>
            </div>

            {/* Garis Linimasa (Timeline) */}
            <div className="space-y-4 relative before:absolute before:bottom-2 before:top-2 before:left-[26px] before:w-0.5 before:bg-slate-200/80">
              {IMMUNIZATION_DATA.map((vaccine) => {
                const isPassed = currentAgeMonths >= vaccine.ageMonths;
                const isChecked = checkedList.includes(vaccine.id);

                return (
                  <motion.div
                    key={vaccine.id}
                    layout
                    className={`bg-white border rounded-3xl p-5 ml-14 relative transition-all duration-300 ${
                      isChecked 
                        ? 'border-emerald-300 bg-emerald-50/20 shadow-sm' 
                        : isPassed 
                        ? 'border-amber-200 bg-amber-50/10' 
                        : 'border-slate-200 shadow-sm'
                    }`}
                  >
                    {/* Lingkaran Indikator Usia di Sebelah Kiri */}
                    <div className={`absolute -left-[45px] top-5 w-8 h-8 rounded-full border-2 font-mono text-xs font-black flex items-center justify-center z-10 transition-colors duration-300 ${
                      isChecked 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : isPassed 
                        ? 'bg-amber-500 border-amber-500 text-white' 
                        : 'bg-white border-slate-300 text-slate-500'
                    }`}>
                      {vaccine.ageMonths}M
                    </div>

                    {/* Konten Utama */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className={`font-bold text-base sm:text-lg tracking-tight ${isChecked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {vaccine.name}
                          </h4>
                          {isPassed && !isChecked && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                              <ShieldAlert size={10} /> Saatnya Suntik!
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
                          {vaccine.desc}
                        </p>
                      </div>

                      {/* Tombol Checklist Interaktif */}
                      <button
                        onClick={() => toggleCheck(vaccine.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border select-none ${
                          isChecked 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        {isChecked ? 'Sudah Suntik' : 'Belum'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* KOTAK INFORMASI BUKU KIA */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl flex gap-3.5 items-start mt-8">
              <BookOpen size={20} className="text-teal-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Catatan Medis Pengingat:</span>
                Jadwal di atas merujuk pada program imunisasi dasar wajib nasional terbaru. Pastikan setiap kali selesai melakukan kunjungan suntik imunisasi, Bunda meminta petugas kesehatan (Bidan/Dokter/Kader) di Posyandu/Puskesmas untuk memparaf dan mencatatnya di lembar fisik <strong className="text-slate-900">Buku KIA warna merah muda</strong> ya, Bun!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}