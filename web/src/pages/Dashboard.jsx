import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// IMPORT FILE ASLI BUNDA
import ClassifierPage from './ClassifierPage'
import GrowthHistoryPage from './GrowthHistoryPage'
import ImmunizationSchedulePage from './ImmunizationSchedulePage'
import HeightPredictorPage from './HeightPredictorPage'
import AboutModelPage from './AboutModelPage'
import GlossaryPage from './GlossaryPage'

import { 
  LayoutDashboard,
  Activity, 
  CalendarDays, 
  Sparkles, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  BrainCircuit,
  Loader2,
  ChevronDown,
  Info,
  BookOpen,
  TrendingUp,
  Scale,
  Ruler,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard-utama') // Default ke Ringkasan Utama
  const [isIndahOpen, setIsIndahOpen] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/masuk')
    }
  }, [user, loading, navigate])

  const handleLogout = () => {
    signOut()
    navigate('/masuk')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin text-teal-700 mx-auto" size={36} />
          <p className="text-sm font-bold text-slate-500 animate-pulse">Menghubungkan sesi aman...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Variasi animasi untuk kartu/grid agar muncul bergantian (stagger effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      
      {/* =========================================================================
          SIDEBAR NAVIGATION (MENU SAMPING COLLAPSIBLE)
          ========================================================================= */}
      <motion.div 
        animate={{ width: isCollapsed ? '80px' : '280px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between static shadow-sm select-none"
      >
        <div className="sticky top-0 max-h-screen overflow-y-auto no-scrollbar">
          {/* Logo Brand */}
          <div className={`p-5 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''} border-b border-slate-100 h-20`}>
            <div className="p-2 bg-teal-700 text-white rounded-xl shadow-md flex-shrink-0">
              <BrainCircuit size={22} />
            </div>
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-serif font-extrabold text-slate-900 text-lg tracking-tight whitespace-nowrap">
                Status Gizi <span className="text-teal-700">AI</span>
              </motion.span>
            )}
          </div>

          {/* LIST NAVIGASI MENU */}
          <div className="p-3 space-y-1 mt-4">
            
            {/* MENU BARU: DASHBOARD UTAMA */}
            <button
              onClick={() => setActiveTab('dashboard-utama')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'dashboard-utama' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={20} className={activeTab === 'dashboard-utama' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
            </button>

            {/* MENU 2: DROPDOWN "INDAH" */}
            <div>
              <button
                onClick={() => {
                  if(isCollapsed) setIsCollapsed(false);
                  setIsIndahOpen(!isIndahOpen);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900 ${(activeTab === 'cek-gizi' || activeTab === 'riwayat') ? 'bg-teal-50/40 text-teal-900' : ''}`}
              >
                <div className="flex items-center gap-3.5">
                  <Activity size={20} className={(activeTab === 'cek-gizi' || activeTab === 'riwayat') ? 'text-teal-700' : 'text-slate-400'} />
                  {!isCollapsed && <span>Indah</span>}
                </div>
                {!isCollapsed && (
                  <motion.div animate={{ rotate: isIndahOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-slate-400" />
                  </motion.div>
                )}
              </button>

              <AnimatePresence>
                {isIndahOpen && !isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-9 pr-2 overflow-hidden space-y-1 mt-1"
                  >
                    <button
                      onClick={() => setActiveTab('cek-gizi')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'cek-gizi' ? 'text-teal-700 bg-teal-50' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'cek-gizi' ? 'bg-teal-600' : 'bg-transparent'}`}></div>
                      Cek Status Gizi
                    </button>
                    <button
                      onClick={() => setActiveTab('riwayat')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'riwayat' ? 'text-teal-700 bg-teal-50' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'riwayat' ? 'bg-teal-600' : 'bg-transparent'}`}></div>
                      Riwayat Pengukuran
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MENU 3: JADWAL IMUNISASI */}
            <button
              onClick={() => setActiveTab('imunisasi')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'imunisasi' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <CalendarDays size={20} className={activeTab === 'imunisasi' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Jadwal Imunisasi</span>}
            </button>

            {/* MENU 4: KALKULATOR TINGGI GENETIK */}
            <button
              onClick={() => setActiveTab('kalkulator-tinggi')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'kalkulator-tinggi' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Sparkles size={20} className={activeTab === 'kalkulator-tinggi' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Kalkulator Tinggi Genetik</span>}
            </button>

            {/* MENU 5: TENTANG MODEL AI */}
            <button
              onClick={() => setActiveTab('about-model')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'about-model' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Info size={20} className={activeTab === 'about-model' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Tentang Model AI</span>}
            </button>

            {/* MENU 6: GLOSARIUM */}
            <button
              onClick={() => setActiveTab('glossary')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'glossary' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <BookOpen size={20} className={activeTab === 'glossary' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Glosarium Gizi</span>}
            </button>

          </div>
        </div>

        {/* FOOTER SIDEBAR */}
        <div className="p-3 border-t border-slate-100 space-y-1.5 sticky bottom-0 bg-white">
          <button onClick={handleLogout} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50/60 transition-all cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
            <LogOut size={20} className="text-rose-500" />
            {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Keluar</motion.span>}
          </button>

          <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full flex items-center justify-center py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer">
            {isCollapsed ? <ChevronRight size={18} /> : <div className="flex items-center gap-2 text-xs font-bold"><ChevronLeft size={18} /> <span>Sembunyikan Menu</span></div>}
          </button>
        </div>
      </motion.div>

      {/* =========================================================================
          PANEL UTAMA KONTEN DASHBOARD
          ========================================================================= */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-x-hidden">
        
        {/* HEADER ATAS */}
        <div className="flex justify-between items-center mb-8 pb-5 border-b border-slate-200/60">
          <div>
            <h1 className="text-2xl font-serif font-extrabold text-slate-900 uppercase tracking-tight">
              {activeTab === 'dashboard-utama' && "Pusat Kendali Informasi"}
              {activeTab === 'cek-gizi' && "Cek Status Gizi Balita"}
              {activeTab === 'riwayat' && "Riwayat Tumbuh Kembang Anak"}
              {activeTab === 'imunisasi' && "Jadwal Imunisasi Nasional"}
              {activeTab === 'kalkulator-tinggi' && "Kalkulator Tinggi Genetik Anak"}
              {activeTab === 'about-model' && "Tentang Model Machine Learning"}
              {activeTab === 'glossary' && "Glosarium & Istilah Medis"}
            </h1>
            <p className="text-sm text-slate-500 font-medium">Sistem Monitoring Tumbuh Kembang Terpadu</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200/70 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm"><User size={16} /></div>
            <span className="text-xs font-bold text-slate-700">{user?.identifier}</span>
          </div>
        </div>

        {/* SWITCHING CONTENT TABS */}
        <AnimatePresence mode="wait">
          
          {/* =========================================================================
              VIEW BARU: KONTEN DASHBOARD UTAMA INTERAKTIF
              ========================================================================= */}
          {activeTab === 'dashboard-utama' && (
            <motion.div 
              key="dashboard-utama" 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Banner Welcome Interaktif */}
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-teal-800 via-teal-900 to-emerald-800 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                <div className="max-w-xl relative z-10">
                  <span className="bg-teal-600/50 text-teal-100 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-teal-500/30">Ringkasan Sistem</span>
                  <h2 className="text-2xl md:text-3xl font-serif font-extrabold mt-3 mb-2">Selamat Datang Kembali, Bunda! 👋</h2>
                  <p className="text-teal-50/80 text-xs md:text-sm leading-relaxed font-medium">Kecerdasan buatan kami mendeteksi tren positif pada kurva pertumbuhan bulanan si Kecil. Pilih modul navigasi di sebelah kiri untuk eksplorasi lebih dalam.</p>
                </div>
              </motion.div>

              {/* Grid Kartu Metrik Informatif dengan Efek Hover */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: "Status Gizi", val: "Gizi Baik (Normal)", sub: "Sesuai standar Z-Score WHO", icon: TrendingUp, bg: "bg-emerald-50 text-emerald-600" },
                  { title: "Berat Badan Terakhir", val: "12.4 Kilogram", sub: "Mengalami kenaikan +0.4kg", icon: Scale, bg: "bg-teal-50 text-teal-600" },
                  { title: "Tinggi Badan", val: "88.5 Centimeter", sub: "Bertambah +1.2cm bulan ini", icon: Ruler, bg: "bg-amber-50 text-amber-600" },
                  { title: "Sistem Imunisasi", val: "Status Aman", sub: "3 Vaksin wajib telah tuntas", icon: ShieldCheck, bg: "bg-indigo-50 text-indigo-600" },
                ].map((card, i) => {
                  const Icon = card.icon
                  return (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md"
                    >
                      <div className={`p-3 rounded-xl ${card.bg}`}><Icon size={22} /></div>
                      <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                        <span className="block text-base font-extrabold text-slate-800 mt-0.5 whitespace-nowrap">{card.val}</span>
                        <span className="block text-[10px] font-medium text-slate-400 mt-0.5">{card.sub}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Section Grafik Batang & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Grafik Interaktif */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="font-serif font-extrabold text-slate-800 text-base">Monitoring Timbangan Bulanan</h3>
                        <p className="text-[11px] font-medium text-slate-400">Rata-rata perkembangan berat badan ideal semester terakhir</p>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-200">Satuan: kg</span>
                    </div>

                    <div className="h-48 flex items-end justify-between pt-6 px-4 border-b border-l border-slate-100 relative">
                      {[
                        { label: 'Jan', height: 'h-[35%]', val: '8.4' },
                        { label: 'Feb', height: 'h-[48%]', val: '9.2' },
                        { label: 'Mar', height: 'h-[55%]', val: '10.1' },
                        { label: 'Apr', height: 'h-[68%]', val: '11.0' },
                        { label: 'Mei', height: 'h-[80%]', val: '11.8' },
                        { label: 'Jun', height: 'h-[95%]', val: '12.4' },
                      ].map((bar, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 w-12 group z-10 cursor-pointer">
                          <span className="text-[10px] font-bold text-teal-700 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-100 shadow-sm">{bar.val}</span>
                          <motion.div 
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: idx * 0.05, duration: 0.5 }}
                            className={`w-full ${bar.height} bg-gradient-to-t from-teal-700 to-teal-500/80 rounded-t-xl group-hover:from-emerald-600 group-hover:to-emerald-400 origin-bottom transition-all duration-200`}
                          ></motion.div>
                          <span className="text-xs font-bold text-slate-400 mt-1">{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Pintasan Cepat & Info Edukasi Singkat */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-extrabold text-slate-800 text-base mb-3">Status Modul AI</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-slate-700">Model Classifier</span>
                          <span className="text-[10px] text-emerald-600 font-bold">● Berjalan Normal</span>
                        </div>
                        <button onClick={() => setActiveTab('cek-gizi')} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"><ArrowUpRight size={14} /></button>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-slate-700">Kalkulator Genetik</span>
                          <span className="text-[10px] text-emerald-600 font-bold">● Siap Digunakan</span>
                        </div>
                        <button onClick={() => setActiveTab('kalkulator-tinggi')} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"><ArrowUpRight size={14} /></button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">💡 <strong>Tips Sehat:</strong> Pastikan asupan zat besi dari daging atau telur terpenuhi setiap hari untuk mencegah risiko stunting sejak dini ya, Bunda!</p>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}
          
          {/* RENDER HALAMAN-HALAMAN ASLI BUNDA */}
          {activeTab === 'cek-gizi' && (
            <motion.div key="cek-gizi" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <ClassifierPage />
            </motion.div>
          )}

          {activeTab === 'riwayat' && (
            <motion.div key="riwayat" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <GrowthHistoryPage />
            </motion.div>
          )}

          {activeTab === 'imunisasi' && (
            <motion.div key="imunisasi" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <PaperAnimationWrapper><ImmunizationSchedulePage /></PaperAnimationWrapper>
            </motion.div>
          )}

          {activeTab === 'kalkulator-tinggi' && (
            <motion.div key="kalkulator-tinggi" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <PaperAnimationWrapper><HeightPredictorPage /></PaperAnimationWrapper>
            </motion.div>
          )}

          {activeTab === 'about-model' && (
            <motion.div key="about-model" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <AboutModelPage />
            </motion.div>
          )}

          {activeTab === 'glossary' && (
            <motion.div key="glossary" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <GlossaryPage />
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  )
}

// Pembungkus tambahan agar halaman bawaan Bunda terlihat rapi dan elegan saat di-render
function PaperAnimationWrapper({ children }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/70 p-2 md:p-6 shadow-sm">
      {children}
    </div>
  )
}