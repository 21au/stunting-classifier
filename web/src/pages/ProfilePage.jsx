import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Users, 
  Baby, 
  Camera, 
  Save, 
  Phone, 
  MapPin, 
  Calendar, 
  Droplet, 
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from 'lucide-react'

export default function ProfilePage() {
  // State Data Orang Tua
  const [parentData, setParentData] = useState({
    ibu: 'Bunda Indah',
    ayah: 'Ayah Budi',
    telp: '081234567890',
    alamat: 'Jember, Jawa Timur'
  })

  // State Data Anak
  const [childData, setChildData] = useState({
    nama: 'Adele Keanu',
    lahir: '2024-05-12',
    gender: 'Laki-laki',
    golDarah: 'O',
    alergi: 'Tidak Ada Alergi Makanan'
  })

  // State Foto Profil Anak
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)
  const [isSaved, setIsSaved] = useState(false)

  // Fungsi Menghitung Usia Anak Secara Otomatis dari Tanggal Lahir
  const calculateAgeInMonths = (birthDate) => {
    if (!birthDate) return 0
    const birth = new Date(birthDate)
    const now = new Date()
    let months = (now.getFullYear() - birth.getFullYear()) * 12
    months -= birth.getMonth()
    months += now.getMonth()
    return months <= 0 ? 0 : months
  }

  // Fungsi Handle Upload Foto
  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3500)
  }

  return (
    <div className="space-y-8 select-none">
      {/* JUDUL HALAMAN */}
      <div>
        <h3 className="font-serif font-extrabold text-slate-800 text-lg">Manajemen Profil & Identitas Klinis</h3>
        <p className="text-xs text-slate-400 font-medium">Kelola informasi dasar keluarga untuk personalisasi kalkulasi data Prophet AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* =========================================================================
            SISI KIRI: LIVE INTERACTIVE DIGITAL KIA CARD & PHOTO UPLOADER
            ========================================================================= */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* DIGITAL KIA CARD BOX */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-teal-600"
          >
            {/* Pola Dekorasi Kartu */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-4 top-4 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 border border-white/10">
              <Sparkles size={10} className="text-amber-300 animate-pulse" />
              <span>KIA Digital Card</span>
            </div>

            {/* Konten Utama Kartu */}
            <div className="flex flex-col items-center text-center mt-4">
              
              {/* Uploader Lingkaran Foto Interaktif */}
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 rounded-full border-4 border-white/20 bg-teal-900/40 flex items-center justify-center overflow-hidden shadow-inner relative"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Foto Anak" className="w-full h-full object-cover" />
                  ) : (
                    <Baby size={44} className="text-teal-200/60" />
                  )}

                  {/* Lapisan Hover Kamera */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera size={18} className="text-white" />
                  </div>
                </motion.div>
                
                {/* Badge Tombol Kamera Kecil */}
                <div className="absolute bottom-0 right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-md border-2 border-teal-800">
                  <Camera size={12} />
                </div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                accept="image/*" 
                className="hidden" 
              />

              {/* Teks Live Preview */}
              <h4 className="text-base font-extrabold mt-4 tracking-tight min-h-[24px]">
                {childData.nama || 'Nama Si Kecil'}
              </h4>
              <p className="text-[11px] text-teal-100/70 font-bold uppercase tracking-wider mt-0.5">
                {childData.gender} • {calculateAgeInMonths(childData.lahir)} Bulan
              </p>

              {/* Garis Pembatas Putus-putus */}
              <div className="w-full border-t border-white/10 my-4 border-dashed" />

              {/* Detail Bagian Bawah Kartu */}
              <div className="w-full grid grid-cols-2 gap-3 text-left text-xs bg-black/10 p-3 rounded-2xl border border-white/5">
                <div>
                  <span className="block text-[9px] text-teal-200/60 font-bold uppercase">Gol. Darah</span>
                  <span className="font-extrabold text-white">{childData.golDarah}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-teal-200/60 font-bold uppercase">Ibu Kandung</span>
                  <span className="font-bold text-white truncate block">{parentData.ibu || '-'}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[9px] text-teal-200/60 font-bold uppercase">Catatan Alergi</span>
                  <span className="text-[11px] font-medium text-amber-200 truncate block">{childData.alergi || 'Tidak Ada'}</span>
                </div>
              </div>

            </div>
          </motion.div>

          <p className="text-[11px] text-slate-400 font-medium leading-relaxed text-center px-2">
            💡 *Klik ikon kamera pada kartu di atas untuk memperbarui foto si kecil langsung dari galeri atau kamera Anda.*
          </p>
        </div>

        {/* =========================================================================
            SISI KANAN: FORM ISIAN DATA (DENGAN LAYOUT RAPI & INFORMATIF)
            ========================================================================= */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* GRUP INPUT: DATA ANAK KANDUNG */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-sm border-b border-slate-100 pb-3">
                <Baby size={18} />
                <span>Atribut Medis Anak</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama Lengkap Anak</label>
                  <input 
                    type="text" 
                    required
                    value={childData.nama} 
                    onChange={e => setChildData({...childData, nama: e.target.value})} 
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 focus:border-teal-600 outline-none bg-slate-50/40 focus:bg-white transition-all shadow-inner-sm" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tanggal Lahir</label>
                    <div className="relative flex items-center">
                      <Calendar size={14} className="absolute left-3 text-slate-400" />
                      <input 
                        type="date" 
                        required
                        value={childData.lahir} 
                        onChange={e => setChildData({...childData, lahir: e.target.value})} 
                        className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 pl-9 focus:border-teal-600 outline-none bg-slate-50/40 focus:bg-white transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Jenis Kelamin</label>
                    <select 
                      value={childData.gender} 
                      onChange={e => setChildData({...childData, gender: e.target.value})} 
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 focus:border-teal-600 outline-none bg-slate-50/40 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Golongan Darah</label>
                    <div className="relative flex items-center">
                      <Droplet size={14} className="absolute left-3 text-rose-500" />
                      <select 
                        value={childData.golDarah} 
                        onChange={e => setChildData({...childData, golDarah: e.target.value})} 
                        className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 pl-9 focus:border-teal-600 outline-none bg-slate-50/40 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                        <option value="Belum Tahu">Belum Dicek</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Riwayat Alergi Anak</label>
                  <div className="relative flex items-center">
                    <AlertTriangle size={14} className="absolute left-3 text-amber-500" />
                    <input 
                      type="text" 
                      placeholder="Sebutkan alergi jika ada (contoh: Alergi Susu Sapi)"
                      value={childData.alergi} 
                      onChange={e => setChildData({...childData, alergi: e.target.value})} 
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 pl-9 focus:border-teal-600 outline-none bg-slate-50/40 focus:bg-white transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* GRUP INPUT: DATA ORANG TUA */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-sm border-b border-slate-100 pb-3">
                <Users size={18} />
                <span>Kontak Wali & Orang Tua</span>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama Ibu Kandung</label>
                    <input 
                      type="text" 
                      required
                      value={parentData.ibu} 
                      onChange={e => setParentData({...parentData, ibu: e.target.value})} 
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 focus:border-teal-600 outline-none bg-slate-50/40 focus:bg-white transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama Ayah</label>
                    <input 
                      type="text" 
                      required
                      value={parentData.ayah} 
                      onChange={e => setParentData({...parentData, ayah: e.target.value})} 
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 focus:border-teal-600 outline-none bg-slate-50/40 focus:bg-white transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">No. WhatsApp</label>
                    <div className="relative flex items-center">
                      <Phone size={14} className="absolute left-3 text-slate-400" />
                      <input 
                        type="tel" 
                        required
                        value={parentData.telp} 
                        onChange={e => setParentData({...parentData, telp: e.target.value})} 
                        className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 pl-9 focus:border-teal-600 outline-none bg-slate-50/40 focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Alamat Domisili Rumah</label>
                    <div className="relative flex items-center">
                      <MapPin size={14} className="absolute left-3 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        value={parentData.alamat} 
                        onChange={e => setParentData({...parentData, alamat: e.target.value})} 
                        className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 pl-9 focus:border-teal-600 outline-none bg-slate-50/40 focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TOMBOL SIMPAN DATA DENGAN POP-UP NOTIFIKASI */}
            <div className="flex justify-end gap-3 items-center pt-2">
              <AnimatePresence>
                {isSaved && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold px-4 py-2 rounded-xl shadow-sm"
                  >
                    <CheckCircle2 size={14} />
                    <span>Sinkronisasi Profil Berhasil!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Save size={16} />
                <span>Simpan Berkas Keluarga</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}