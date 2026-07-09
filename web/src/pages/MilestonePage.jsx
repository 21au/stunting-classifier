import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Square, Award, ArrowRight } from 'lucide-react'

// Data berdasarkan instrumen KPSP Buku KIA Kemenkes RI
const milestoneData = {
  "6-bulan": [
    { id: 1, text: "Berbalik dari telungkup ke telentang atau sebaliknya", aspek: "Motorik Kasar" },
    { id: 2, text: "Mempertahankan posisi kepala tetap tegak dan stabil", aspek: "Motorik Kasar" },
    { id: 3, text: "Meraih benda yang ada di jangkauannya", aspek: "Motorik Halus" },
    { id: 4, text: "Menoleh ke arah sumber suara atau panggilan", aspek: "Bicara & Bahasa" },
    { id: 5, text: "Tersenyum ketika melihat mainan/benda menarik", aspek: "Sosialisasi & Kemandirian" }
  ],
  "9-bulan": [
    { id: 6, text: "Duduk sendiri tanpa bantuan dengan stabil", aspek: "Motorik Kasar" },
    { id: 7, text: "Merangkak atau menggeser tubuh di lantai", aspek: "Motorik Kasar" },
    { id: 8, text: "Memindahkan benda dari tangan satu ke tangan lainnya", aspek: "Motorik Halus" },
    { id: 9, text: "Mengeluarkan suara tanpa arti seperti 'da-da', 'ma-ma'", aspek: "Bicara & Bahasa" },
    { id: 10, text: "Bermain 'ci-luk-ba' atau melambaikan tangan", aspek: "Sosialisasi & Kemandirian" }
  ],
  "12-bulan": [
    { id: 11, text: "Berdiri sendiri tanpa berpegangan selama beberapa detik", aspek: "Motorik Kasar" },
    { id: 12, text: "Berjalan dengan dituntun atau melangkah mandiri", aspek: "Motorik Kasar" },
    { id: 13, text: "Menjepit benda kecil dengan ibu jari dan telunjuk", aspek: "Motorik Halus" },
    { id: 14, text: "Mengatakan 1-2 kata bermakna spesifik", aspek: "Bicara & Bahasa" },
    { id: 15, text: "Menunjuk benda yang diinginkan untuk menyatakan kemauan", aspek: "Sosialisasi & Kemandirian" }
  ]
}

export default function MilestonePage() {
  const [selectedAge, setSelectedAge] = useState("6-bulan")
  const [checkedItems, setCheckedItems] = useState({})

  const currentMilestones = milestoneData[selectedAge] || []
  
  const handleToggle = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const completedCount = currentMilestones.filter(m => checkedItems[m.id]).length
  const progressPercent = Math.round((completedCount / currentMilestones.length) * 100) || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
        <div>
          <h3 className="font-serif font-extrabold text-slate-800 text-base">Skrining Perkembangan (KPSP)</h3>
          <p className="text-xs text-slate-400 font-medium">Berdasarkan acuan standarisasi Buku KIA Kemenkes RI</p>
        </div>
        <select 
          value={selectedAge} 
          onChange={(e) => { setSelectedAge(e.target.value); setCheckedItems({}); }}
          className="bg-white border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl outline-none cursor-pointer shadow-sm focus:border-teal-600"
        >
          <option value="6-bulan">Usia Skrining 6 Bulan</option>
          <option value="9-bulan">Usia Skrining 9 Bulan</option>
          <option value="12-bulan">Usia Skrining 12 Bulan</option>
        </select>
      </div>

      {/* Progress Card */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="relative w-16 h-16 flex items-center justify-center bg-teal-50 rounded-full border border-teal-100 text-teal-700 font-extrabold text-sm">
          {progressPercent}%
        </div>
        <div className="flex-1">
          <span className="block text-xs font-bold text-slate-700">Tingkat Capaian Indikator</span>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="bg-teal-600 h-full rounded-full" />
          </div>
          <span className="block text-[10px] text-slate-400 mt-1.5 font-medium">
            {completedCount} dari {currentMilestones.length} indikator perkembangan berhasil terpenuhi.
          </span>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-2.5">
        {currentMilestones.map((milestone) => {
          const isDone = !!checkedItems[milestone.id]
          return (
            <div 
              key={milestone.id} 
              onClick={() => handleToggle(milestone.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${isDone ? 'bg-teal-50/20 border-teal-200/80' : 'bg-white border-slate-200/60 hover:bg-slate-50'}`}
            >
              <div className="mt-0.5 text-teal-600 flex-shrink-0">
                {isDone ? <CheckSquare size={19} className="fill-teal-50" /> : <Square size={19} className="text-slate-300" />}
              </div>
              <div className="flex-1">
                <p className={`text-xs font-bold leading-relaxed ${isDone ? 'text-slate-800 line-through opacity-70' : 'text-slate-700'}`}>{milestone.text}</p>
                <span className="inline-block text-[9px] font-extrabold uppercase bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md mt-1.5 tracking-wider">{milestone.aspek}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Kesimpulan Interpretasi Medis Buku KIA */}
      {progressPercent === 100 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800">
          <Award size={20} />
          <p className="text-xs font-bold">Interpretasi KIA: Perkembangan si Kecil dinilai SESUAI (S) dengan tahapan usianya. Teruskan stimulasi berkala!</p>
        </motion.div>
      )}
    </div>
  )
}