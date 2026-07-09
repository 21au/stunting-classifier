import { useState } from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

const initialTeeth = [
  { id: 'I1-down', name: 'Gigi Seri Tengah Bawah', age: '6-10 Bulan', status: false, date: '' },
  { id: 'I1-up', name: 'Gigi Seri Tengah Atas', age: '8-12 Bulan', status: false, date: '' },
  { id: 'I2-up', name: 'Gigi Seri Samping Atas', age: '9-13 Bulan', status: false, date: '' },
  { id: 'I2-down', name: 'Gigi Seri Samping Bawah', age: '10-16 Bulan', status: false, date: '' },
  { id: 'M1-up', name: 'Gigi Geraham Pertama Atas', age: '13-19 Bulan', status: false, date: '' },
  { id: 'M1-down', name: 'Gigi Geraham Pertama Bawah', age: '14-18 Bulan', status: false, date: '' },
  { id: 'C1-up', name: 'Gigi Taring Atas', age: '16-22 Bulan', status: false, date: '' },
  { id: 'C1-down', name: 'Gigi Taring Bawah', age: '17-23 Bulan', status: false, date: '' }
]

export default function TeethingTrackerPage() {
  const [teeth, setTeeth] = useState(initialTeeth)

  const toggleTeeth = (id) => {
    setTeeth(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: !t.status, date: !t.status ? new Date().toLocaleDateString('id-ID') : '' }
      }
      return t
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif font-extrabold text-slate-800 text-base">Erupsi Gigi Susu (Teething Tracker)</h3>
        <p className="text-xs text-slate-400 font-medium">Berdasarkan Jurnal Log Erupsi Gigi Desidua (Pedodonti)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teeth.map((t) => (
          <div 
            key={t.id}
            onClick={() => toggleTeeth(t.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${t.status ? 'bg-teal-50/30 border-teal-200' : 'bg-white border-slate-200/60'}`}
          >
            <div>
              <span className="block text-xs font-bold text-slate-800">{t.name}</span>
              <span className="block text-[10px] text-slate-400 font-medium mt-0.5">Estimasi Teoretis Jurnal: {t.age}</span>
              {t.status && (
                <span className="inline-block text-[10px] bg-teal-600 text-white font-bold px-2 py-0.5 rounded-md mt-2"> tumbuh pada: {t.date}</span>
              )}
            </div>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border ${t.status ? 'bg-teal-600 border-teal-600 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              🦷
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}