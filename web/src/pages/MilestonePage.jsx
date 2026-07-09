import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Circle, 
  Baby, 
  Activity, 
  MessageSquare, 
  Users, 
  Lightbulb, 
  Award, 
  ChevronRight, 
  Bookmark,
  Sparkles
} from 'lucide-react'

// DATA MASTER MILESTONE PERKEMBANGAN SESUAI STANDAR BUKU KIA KEMENKES
const milestoneData = [
  {
    id: '0-3',
    ageRange: '0 - 3 Bulan',
    color: 'from-sky-500 to-indigo-600',
    lightBg: 'bg-sky-50/50',
    borderColor: 'border-sky-100',
    textAccent: 'text-sky-700',
    items: [
      { id: 'm1', task: 'Mengangkat kepala tegak sekejap saat ditelungkupkan', category: 'motorik' },
      { id: 'm2', task: 'Mengikuti objek bergerak dengan pandangan mata', category: 'motorik' },
      { id: 'm3', task: 'Mengoceh spontan atau bereaksi dengan suara (cooing)', category: 'bicara' },
      { id: 'm4', task: 'Tersenyum kembali ketika diajak bicara atau tersenyum (social smile)', category: 'sosial' },
    ],
    stimulation: 'Sering peluk dan timang bayi, ajak berbicara setiap saat, latih bayi telungkup (tummy time) secara berkala sambil diajak menatap wajah Bunda.'
  },
  {
    id: '3-6',
    ageRange: '3 - 6 Bulan',
    color: 'from-teal-500 to-emerald-600',
    lightBg: 'bg-teal-50/50',
    borderColor: 'border-teal-100',
    textAccent: 'text-teal-700',
    items: [
      { id: 'm5', task: 'Berbalik dari telungkup ke telentang atau sebaliknya', category: 'motorik' },
      { id: 'm6', task: 'Mengangkat kepala hingga 90 derajat saat posisi telungkup', category: 'motorik' },
      { id: 'm7', task: 'Meraih, memegang benda kecil, atau memasukkan mainan ke mulut', category: 'motorik' },
      { id: 'm8', task: 'Tertawa keras dan berteriak gembira saat diajak bermain', category: 'bicara' },
    ],
    stimulation: 'Letakkan mainan cerah sedikit di luar jangkauannya agar ia berusaha meraihnya. Latih berguling ke kanan dan ke kiri.'
  },
  {
    id: '6-9',
    ageRange: '6 - 9 Bulan',
    color: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50/50',
    borderColor: 'border-amber-100',
    textAccent: 'text-amber-700',
    items: [
      { id: 'm9', task: 'Duduk sendiri tanpa dibantu dalam waktu singkat', category: 'motorik' },
      { id: 'm10', task: 'Memindahkan benda dari satu tangan ke tangan yang lain', category: 'motorik' },
      { id: 'm11', task: 'Mengucapkan suku kata ganda tanpa arti (ba-ba, ma-ma, da-da)', category: 'bicara' },
      { id: 'm12', task: 'Mulai memperlihatkan rasa takut/asing pada orang yang belum dikenal', category: 'sosial' },
    ],
    stimulation: 'Dudukkan bayi di lantai berselimut empuk dengan bantal penyangga. Ajarkan permainan interaktif seperti "Ciluk-Ba" dan lambaian tangan.'
  },
  {
    id: '9-12',
    ageRange: '9 - 12 Bulan',
    color: 'from-rose-500 to-pink-600',
    lightBg: 'bg-rose-50/50',
    borderColor: 'border-rose-100',
    textAccent: 'text-rose-700',
    items: [
      { id: 'm13', task: 'Berdiri sendiri tanpa pegangan selama beberapa detik', category: 'motorik' },
      { id: 'm14', task: 'Berjalan beberapa langkah dengan dipapah atau berpegangan furniture', category: 'motorik' },
      { id: 'm15', task: 'Menyebut 2-3 kata pendek yang bermakna (mama, papa, mimi)', category: 'bicara' },
      { id: 'm16', task: 'Menunjuk atau meraih benda yang diinginkan untuk berkomunikasi', category: 'sosial' },
    ],
    stimulation: 'Latih anak berjalan tegak tanpa alas kaki di permukaan aman. Ajari menyebutkan nama benda di sekitarnya dan bernyanyi bersama.'
  },
  {
    id: '12-24',
    ageRange: '12 - 24 Bulan',
    color: 'from-purple-500 to-fuchsia-600',
    lightBg: 'bg-purple-50/50',
    borderColor: 'border-purple-100',
    textAccent: 'text-purple-700',
    items: [
      { id: 'm17', task: 'Berjalan sendiri dengan mantap tanpa mudah terjatuh', category: 'motorik' },
      { id: 'm18', task: 'Menyusun menara menggunakan 2-4 kubus/balok mainan', category: 'motorik' },
      { id: 'm19', task: 'Mampu memahami dan mengikuti instruksi sederhana (cth: "Ambil bolanya")', category: 'bicara' },
      { id: 'm20', task: 'Mulai belajar makan menggunakan sendok sendiri walau berantakan', category: 'sosial' },
    ],
    stimulation: 'Beri anak kesempatan mengeksplorasi lingkungan, ajarkan menyusun balok, menggambar coret-coret di kertas besar, dan biasakan minum dari gelas.'
  }
]

export default function MilestonePage() {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0)
  // State untuk menyimpan ID checklist yang berhasil dipenuhi anak
  const [checkedItems, setCheckedItems] = useState({})

  const currentGroup = milestoneData[activeGroupIndex]

  // Fungsi toggle ceklist milestone
  const handleToggleCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  // Hitung jumlah item yang dicentang pada kelompok usia aktif saat ini
  const activeGroupItems = currentGroup.items
  const checkedInActiveGroup = activeGroupItems.filter(item => checkedItems[item.id]).length
  const progressPercentage = Math.round((checkedInActiveGroup / activeGroupItems.length) * 100)

  // Helper untuk menentukan icon berdasarkan kategori perkembangan KIA
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'motorik': return <Activity size={14} className="text-emerald-600" />
      case 'bicara': return <MessageSquare size={14} className="text-sky-600" />
      case 'sosial': return <Users size={14} className="text-purple-600" />
      default: return <Baby size={14} />
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <Bookmark className="text-teal-700 fill-teal-100" size={22} />
            Lembar Pantau KIA Interaktif
          </h3>
          <p className="text-xs text-slate-400 font-medium">Berdasarkan indikator resmi KPSP & Buku Kesehatan Ibu dan Anak (KIA)</p>
        </div>

        {/* REKAP BADGE STATUS */}
        <div className="bg-teal-50 border border-teal-100/80 rounded-2xl p-3 flex items-center gap-3 self-start md:self-auto shadow-sm">
          <div className="p-2 bg-teal-700 text-white rounded-xl"><Award size={18} /></div>
          <div>
            <span className="block text-[10px] text-teal-600 font-bold uppercase tracking-wider">Status Capaian</span>
            <span className="text-xs font-extrabold text-slate-800">
              {progressPercentage === 100 ? "🎉 Sempurna (Sesuai Usia)" : `${checkedInActiveGroup} dari ${activeGroupItems.length} Indikator Terpenuhi`}
            </span>
          </div>
        </div>
      </div>

      {/* TABS SELECTOR USIA (GAYA BUKU YANG BERGESER) */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar border-b border-slate-100">
        {milestoneData.map((group, index) => (
          <button
            key={group.id}
            onClick={() => setActiveGroupIndex(index)}
            className={`px-4 py-3 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 border cursor-pointer ${
              index === activeGroupIndex 
                ? `bg-gradient-to-r ${group.color} text-white shadow-md border-transparent scale-102` 
                : 'bg-white text-slate-500 border-slate-200/70 hover:bg-slate-50'
            }`}
          >
            <span>{group.ageRange}</span>
            <ChevronRight size={12} className={index === activeGroupIndex ? 'text-white' : 'text-slate-400'} />
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT: JENDELA BUKU KIA DIGITAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* PANEL KIRI: DAFTAR CHECKLIST INDIKATOR (2 KOLOM RES) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-inner-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className={currentGroup.textAccent} />
                Daftar Evaluasi Kemampuan Anak
              </span>
              <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${currentGroup.lightBg} ${currentGroup.textAccent}`}>
                Target Usia {currentGroup.ageRange}
              </span>
            </div>

            {/* DAFTAR CHECKLIST BERANIMASI */}
            <div className="space-y-2.5">
              <AnimatePresence mode="wait">
                {currentGroup.items.map((item) => {
                  const isChecked = !!checkedItems[item.id]
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={() => handleToggleCheck(item.id)}
                      className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all cursor-pointer select-none group ${
                        isChecked 
                          ? 'bg-slate-50/80 border-slate-300/80' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Animasi Centang */}
                      <div className="mt-0.5 flex-shrink-0">
                        {isChecked ? (
                          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-teal-700">
                            <CheckCircle2 size={19} className="fill-teal-50" />
                          </motion.div>
                        ) : (
                          <Circle size={19} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                        )}
                      </div>

                      {/* Isi Teks Deskripsi Milestone */}
                      <div className="space-y-1 flex-1">
                        <p className={`text-xs font-bold leading-relaxed transition-all ${isChecked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {item.task}
                        </p>
                        
                        {/* Tag Kategori Aspek Perkembangan */}
                        <div className="flex items-center gap-1 bg-slate-100/80 px-2 py-0.5 rounded-md w-max">
                          {getCategoryIcon(item.category)}
                          <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">{item.category}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: DYNAMIC PROGRESS WHEEL & TIPS STIMULASI */}
        <div className="space-y-4 lg:col-span-1">
          
          {/* CARD PROGRESS ANIMASI */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm text-center space-y-4">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Persentase Perkembangan</span>
            
            {/* Meteran Batang Visual */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className={`text-[10px] font-extrabold inline-block py-1 px-2.5 uppercase rounded-full ${currentGroup.lightBg} ${currentGroup.textAccent}`}>
                    Grafik Pantau
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-extrabold inline-block ${currentGroup.textAccent}`}>
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-100 border border-slate-200/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${currentGroup.color}`}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              *Centang seluruh indikator di samping kiri jika si kecil sudah mahir melakukannya sehari-hari di rumah.
            </p>
          </div>

          {/* CARD INFORMASI STIMULASI KIA */}
          <motion.div 
            key={`stim-${currentGroup.id}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`border rounded-2xl p-5 shadow-sm space-y-3 bg-gradient-to-b from-white to-slate-50/50 ${currentGroup.borderColor}`}
          >
            <div className="flex items-center gap-2 font-bold text-xs text-slate-700 border-b border-slate-100 pb-2.5">
              <div className={`p-1.5 rounded-lg ${currentGroup.lightBg} ${currentGroup.textAccent}`}>
                <Lightbulb size={15} />
              </div>
              <span>Panduan Stimulasi Usia {currentGroup.ageRange}</span>
            </div>
            
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              {currentGroup.stimulation}
            </p>
          </motion.div>

        </div>

      </div>
    </div>
  )
}