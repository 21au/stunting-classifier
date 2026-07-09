import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// IMPORT FILE-FILE ASLI BUNDA
import ClassifierPage from './ClassifierPage'
import GrowthHistoryPage from './GrowthHistoryPage'
import ImmunizationSchedulePage from './ImmunizationSchedulePage'
import HeightPredictorPage from './HeightPredictorPage'
import AboutModelPage from './AboutModelPage'
import GlossaryPage from './GlossaryPage'

// IMPORT DUA FITUR BARU BERDASARKAN JURNAL & BUKU KIA
import MilestonePage from './MilestonePage'
import TeethingTrackerPage from './TeethingTrackerPage'

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
  ArrowUpRight,
  CheckSquare,
  Smile
} from 'lucide-react'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard-utama') 
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
            
            {/* 1. DASHBOARD */}
            <button
              onClick={() => setActiveTab('dashboard-utama')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'dashboard-utama' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={20} className={activeTab === 'dashboard-utama' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
            </button>

            {/* 2. DROPDOWN "INDAH" */}
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

            {/* 3. JADWAL IMUNISASI */}
            <button
              onClick={() => setActiveTab('imunisasi')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'imunisasi' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <CalendarDays size={20} className={activeTab === 'imunisasi' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Jadwal Imunisasi</span>}
            </button>

            {/* 4. KALKULATOR TINGGI GENETIK */}
            <button
              onClick={() => setActiveTab('kalkulator-tinggi')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'kalkulator-tinggi' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Sparkles size={20} className={activeTab === 'kalkulator-tinggi' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Kalkulator Tinggi Genetik</span>}
            </button>

            {/* FITUR BARU: 5. MILESTONE BUKU KIA */}
            <button
              onClick={() => setActiveTab('milestone')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'milestone' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <CheckSquare size={20} className={activeTab === 'milestone' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Milestone Buku KIA</span>}
            </button>

            {/* FITUR BARU: 6. TRACKER GIGI JURNAL */}
            <button
              onClick={() => setActiveTab('teething')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'teething' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Smile size={20} className={activeTab === 'teething' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Pertumbuhan Gigi</span>}
            </button>

            {/* 7. TENTANG MODEL AI */}
            <button
              onClick={() => setActiveTab('about-model')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'about-model' ? 'text-teal-800 bg-teal-50/70 shadow-sm border border-teal-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Info size={20} className={activeTab === 'about-model' ? 'text-teal-700' : 'text-slate-400'} />
              {!isCollapsed && <span className="whitespace-nowrap">Tentang Model AI</span>}
            </button>

            {/* 8. GLOSARIUM */}
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
              {activeTab === 'milestone' && "Milestone Tumbuh Kembang (Buku KIA)"}
              {activeTab === 'teething' && "Tracker Pertumbuhan Gigi Anak"}
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
          
          {/* VIEW: KONTEN DASHBOARD UTAMA */}
          {activeTab === 'dashboard-utama' && (
            <motion.div key="dashboard-utama" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-6 md:p-8 text-white shadow-md">
                <h2 className="text-2xl font-serif font-extrabold mb-2">Selamat Datang Kembali, Bunda! 👋</h2>
                <p className="text-teal-50/80 text-xs md:text-sm leading-relaxed">Aplikasi Pemantauan Terintegrasi Standar Kemenkes RI dan Validasi Jurnal Kesehatan.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: "Status Gizi", val: "Gizi Baik (Normal)", sub: "Standar Z-Score WHO", icon: TrendingUp, bg: "bg-emerald-50 text-emerald-600" },
                  { title: "Berat Badan", val: "12.4 Kilogram", sub: "Data pengukuran terakhir", icon: Scale, bg: "bg-teal-50 text-teal-600" },
                  { title: "Tinggi Badan", val: "88.5 Centimeter", sub: "Data pengukuran terakhir", icon: Ruler, bg: "bg-amber-50 text-amber-600" },
                  { title: "Sistem Imunisasi", val: "Status Aman", sub: "3 Vaksin utama lengkap", icon: ShieldCheck, bg: "bg-indigo-50 text-indigo-600" },
                ].map((card, i) => {
                  const Icon = card.icon
                  return (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${card.bg}`}><Icon size={22} /></div>
                      <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase">{card.title}</span>
                        <span className="block text-base font-extrabold text-slate-800 mt-0.5">{card.val}</span>
                        <span className="block text-[10px] text-slate-400 font-medium">{card.sub}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
          
          {/* RENDER HALAMAN LAINNYA */}
          {activeTab === 'cek-gizi' && <motion.div key="cek-gizi" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ClassifierPage /></motion.div>}
          {activeTab === 'riwayat' && <motion.div key="riwayat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><GrowthHistoryPage /></motion.div>}
          {activeTab === 'imunisasi' && <motion.div key="imunisasi" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PaperWrapper><ImmunizationSchedulePage /></PaperWrapper></motion.div>}
          {activeTab === 'kalkulator-tinggi' && <motion.div key="kalkulator-tinggi" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PaperWrapper><HeightPredictorPage /></PaperWrapper></motion.div>}
          {activeTab === 'about-model' && <motion.div key="about-model" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><AboutModelPage /></motion.div>}
          {activeTab === 'glossary' && <motion.div key="glossary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><GlossaryPage /></motion.div>}
          
          {/* SWITCH KONTEN UNTUK FITUR BARU */}
          {activeTab === 'milestone' && <motion.div key="milestone" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}><PaperWrapper><MilestonePage /></PaperWrapper></motion.div>}
          {activeTab === 'teething' && <motion.div key="teething" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}><PaperWrapper><TeethingTrackerPage /></PaperWrapper></motion.div>}

        </AnimatePresence>

      </div>
    </div>
  )
}

function PaperWrapper({ children }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/70 p-4 md:p-6 shadow-sm">
      {children}
    </div>
  )
}