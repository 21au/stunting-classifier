import { useState } from 'react'
import { LineChart, ClipboardPlus, TrendingUp, HelpCircle } from 'lucide-react'

export default function AnthropometryInputPage({ onNextStep }) {
  // Ditambahkan tanggal ukur agar Prophet mendapat kolom 'ds' (datestamp) yang valid
  const [form, setForm] = useState({
    tanggalUkur: new Date().toISOString().split('T')[0],
    umur: '14',
    berat: '',
    tinggi: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // DATA STRUKTUR YANG SIAP DIKIRIM KE API PROPHET (ds dan y)
    const payloadUntukProphet = {
      tgl_ds: form.tanggalUkur, // Kolom 'ds' untuk Prophet
      usia_bulan: parseInt(form.umur),
      berat_y1: parseFloat(form.berat), // Kolom 'y' pertama
      tinggi_y2: parseFloat(form.tinggi) // Kolom 'y' kedua
    }

    console.log("Data siap di-feeding ke Model Prophet:", payloadUntukProphet)
    
    // Alihkan langsung ke halaman riwayat/grafik prediksi setelah disave
    if(onNextStep) onNextStep('riwayat')
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 text-teal-700 mb-1">
          <TrendingUp size={20} />
          <span className="text-xs font-extrabold uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-full">Prophet Engine Input</span>
        </div>
        <h3 className="font-serif font-extrabold text-slate-800 text-base">Feeding Data Tren Pertumbuhan</h3>
        <p className="text-xs text-slate-400 font-medium">Input metrik bulanan untuk memproyeksikan estimasi tinggi dan berat badan anak di masa depan</p>
      </div>

      {/* NOTIFIKASI EDUKASI PROPHET */}
      <div className="p-4 bg-teal-50/60 border border-teal-100 rounded-2xl flex items-start gap-3 text-teal-900">
        <HelpCircle size={18} className="mt-0.5 text-teal-700 flex-shrink-0" />
        <div className="text-xs space-y-1">
          <p className="font-bold">Bagaimana AI Memprediksi?</p>
          <p className="text-slate-600 font-medium leading-relaxed">
            Makin banyak titik data bulanan yang Bunda masukkan, semakin akurat algoritma machine learning memetakan tren linear maupun musiman pertumbuhan si kecil untuk bulan-bulan berikutnya.
          </p>
        </div>
      </div>

      {/* FORM ENTRI DATA */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm max-w-xl space-y-4">
        
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tanggal Pengukuran (ds)</label>
          <input 
            type="date" 
            required 
            value={form.tanggalUkur} 
            onChange={e => setForm({...form, tanggalUkur: e.target.value})} 
            className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 outline-none focus:border-teal-600 bg-slate-50/30 focus:bg-white" 
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Usia Saat Ini</label>
            <div className="relative flex items-center">
              <input 
                type="number" 
                required 
                value={form.umur} 
                onChange={e => setForm({...form, umur: e.target.value})} 
                className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 pr-12 outline-none focus:border-teal-600 bg-slate-50/30 focus:bg-white" 
              />
              <span className="absolute right-3 text-[9px] font-extrabold text-slate-400 uppercase">Bln</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Berat (y: Target 1)</label>
            <div className="relative flex items-center">
              <input 
                type="number" 
                required 
                step="0.01" 
                placeholder="0.0" 
                value={form.berat} 
                onChange={e => setForm({...form, berat: e.target.value})} 
                className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 pr-10 outline-none focus:border-teal-600 bg-slate-50/30 focus:bg-white" 
              />
              <span className="absolute right-3 text-[9px] font-extrabold text-slate-400 uppercase">Kg</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tinggi (y: Target 2)</label>
            <div className="relative flex items-center">
              <input 
                type="number" 
                required 
                step="0.1" 
                placeholder="0.0" 
                value={form.tinggi} 
                onChange={e => setForm({...form, tinggi: e.target.value})} 
                className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 pr-10 outline-none focus:border-teal-600 bg-slate-50/30 focus:bg-white" 
              />
              <span className="absolute right-3 text-[9px] font-extrabold text-slate-400 uppercase">Cm</span>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-sm cursor-pointer mt-2">
          <ClipboardPlus size={16} />
          <span>Simpan & Plot Tren Prediksi AI</span>
          <LineChart size={14} />
        </button>
      </form>
    </div>
  )
}