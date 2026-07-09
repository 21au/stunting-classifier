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
import MilestonePage from './MilestonePage'
import TeethingTrackerPage from './TeethingTrackerPage'

// IMPORT 2 HALAMAN BARU (PROFIL & INPUT ANTROPOMETRI)
import ProfilePage from './ProfilePage'
import AnthropometryInputPage from './AnthropometryInputPage'

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
  TrendingUp,
  Scale,
  Ruler,
  ShieldCheck,
  CheckSquare,
  Smile,
  BookOpen,
  ArrowUpRight,
  AlertCircle,
  Plus,
  Baby
} from 'lucide-react'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard-utama') 
  
  const [isIndahOpen, setIsIndahOpen] = useState(true)
  const [isEdukasiOpen, setIsEdukasiOpen] = useState(false)

  // ==========================================
  // STATE BARU KHUSUS INTERAKSI DASHBOARD UTAMA
  // ==========================================
  const [selectedChild, setSelectedChild] = useState('alif')
  const [chartView, setChartView] = useState('tinggi') // 'tinggi' atau 'berat'
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: "Berikan MPASI Protein Hewani (Telur/Daging)", checked: true },
    { id: 2, text: "Suplemen Vitamin D & Zat Besi sesuai dosis", checked: false },
    { id: 3, text: "Tensi stimulasi motorik kasar 15 menit", checked: false },
    { id: 4, text: "Cek jadwal imunisasi bulan depan", checked: false },
  ])

  useEffect(() => {
    if (!loading && !user) {
      navigate('/masuk')
    }
  }, [user, loading, navigate])

  const handleLogout = () => {
    signOut()
    navigate('/masuk')
  }

  // Fungsi interaktif mencentang rekomendasi gizi
  const toggleChecklist = (id) => {
    setChecklistItems(checklistItems.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  // Data simulasi anak untuk fitur interaktif
  const childrenData = {
    alif: {
      name: "Muhammad Alif",
      age: "24 Bulan",
      status: "Gizi Baik (Normal)",
      weight: "12.4 kg",
      weightTrend: "+0.4 kg",
      height: "88.5 cm",
      heightTrend: "+1.2 cm",
      zscore: "0.15 SD (Aman)",
      tips: "Perkembangan Alif sangat baik dan sesuai kurva WHO. Fokuskan bulan ini pada pengenalan tekstur makanan padat yang lebih bervariasi.",
      chartData: [72, 75, 78, 81, 84, 88.5] // Data tinggi 6 bulan terakhir
    },
    alya: {
      name: "Siti Alya",
      age: "12 Bulan",
      status: "Beresiko Stunting (Gizi Kurang)",
      weight: "7.8 kg",
      weightTrend: "-0.1 kg",
      height: "71.0 cm",
      heightTrend: "+0.5 cm",
      zscore: "-2.01 SD (Waspada)",
      tips: "Deteksi AI mendeteksi pertumbuhan tinggi badan Alya melambat. Disarankan segera jadwalkan konsultasi ke Puskesmas dan genjot konsumsi susu & protein makro.",
      chartData: [65, 67, 68, 69, 70, 71]
    }
  }

  const currentChild = childrenData[selectedChild]

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
    <div className="flex h-screen w-full bg-slate-50/50 overflow-hidden font-sans">
      
      {/* =========================================================
          SIDEBAR NAVIGATION (SISI KIRI - TETAP FIX DIAM)
          ========================================================= */}
      <motion.div 
        animate={{ width: isCollapsed ? '80px' : '280px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-white border-r border-slate-200/80 h-screen flex flex-col shadow-sm select-none flex-shrink-0 z-10"
      >
        {/* BAGIAN ATAS (LOGO) */}
        <div className={`p-5 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''} border-b border-slate-100 h-20 flex-shrink-0`}>
          <div className="p-2 bg-teal-700 text-white rounded-xl shadow-md flex-shrink-0">
            <BrainCircuit size={22} />
          </div>
          {!isCollapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-serif font-extrabold text-slate-900 text-lg tracking-tight whitespace-nowrap">
              Status Gizi <span className="text-teal-700">AI</span>
            </motion.span>
          )}
        </div>

        {/* BAGIAN TENGAH (LIST NAVIGASI MENU - SCROLL JIKA BANYAK) */}
        <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-1 no-scrollbar mt-1">
          
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
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900 ${(activeTab === 'input-antropometri' || activeTab === 'cek-gizi' || activeTab === 'riwayat') ? 'bg-teal-50/40 text-teal-900' : ''}`}
            >
              <div className="flex items-center gap-3.5">
                <Activity size={20} className={(activeTab === 'input-antropometri' || activeTab === 'cek-gizi' || activeTab === 'riwayat') ? 'text-teal-700' : 'text-slate-400'} />
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
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pl-9 pr-2 overflow-hidden space-y-1 mt-1">
                  <button onClick={() => setActiveTab('input-antropometri')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'input-antropometri' ? 'text-teal-700 bg-teal-50' : 'text-slate-500 hover:text-slate-800'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'input-antropometri' ? 'bg-teal-600' : 'bg-transparent'}`}></div>
                    Input Antropometri
                  </button>
                  <button onClick={() => setActiveTab('cek-gizi')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'cek-gizi' ? 'text-teal-700 bg-teal-50' : 'text-slate-500 hover:text-slate-800'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'cek-gizi' ? 'bg-teal-600' : 'bg-transparent'}`}></div>
                    Cek Status Gizi
                  </button>
                  <button onClick={() => setActiveTab('riwayat')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'riwayat' ? 'text-teal-700 bg-teal-50' : 'text-slate-500 hover:text-slate-800'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'riwayat' ? 'bg-teal-600' : 'bg-transparent'}`}></div>
                    Riwayat Pengukuran
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. MENU LAINNYA */}
          <button onClick={() => setActiveTab('imunisasi')} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'imunisasi' ? 'text-teal-800 bg-teal-50/70 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
            <CalendarDays size={20} className={activeTab === 'imunisasi' ? 'text-teal-700' : 'text-slate-400'} />
            {!isCollapsed && <span className="whitespace-nowrap">Jadwal Imunisasi</span>}
          </button>

          <button onClick={() => setActiveTab('kalkulator-tinggi')} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'kalkulator-tinggi' ? 'text-teal-800 bg-teal-50/70 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Sparkles size={20} className={activeTab === 'kalkulator-tinggi' ? 'text-teal-700' : 'text-slate-400'} />
            {!isCollapsed && <span className="whitespace-nowrap">Kalkulator Tinggi Genetik</span>}
          </button>

          <button onClick={() => setActiveTab('milestone')} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'milestone' ? 'text-teal-800 bg-teal-50/70 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
            <CheckSquare size={20} className={activeTab === 'milestone' ? 'text-teal-700' : 'text-slate-400'} />
            {!isCollapsed && <span className="whitespace-nowrap">Milestone Buku KIA</span>}
          </button>

          <button onClick={() => setActiveTab('teething')} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'teething' ? 'text-teal-800 bg-teal-50/70 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Smile size={20} className={activeTab === 'teething' ? 'text-teal-700' : 'text-slate-400'} />
            {!isCollapsed && <span className="whitespace-nowrap">Pertumbuhan Gigi</span>}
          </button>

          {/* 4. DROPDOWN EDUKASI */}
          <div>
            <button onClick={() => { if(isCollapsed) setIsCollapsed(false); setIsEdukasiOpen(!isEdukasiOpen); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer text-slate-600 hover:bg-slate-50 ${(activeTab === 'about-model' || activeTab === 'glossary') ? 'bg-teal-50/40 text-teal-900' : ''}`}>
              <div className="flex items-center gap-3.5">
                <BookOpen size={20} className={(activeTab === 'about-model' || activeTab === 'glossary') ? 'text-teal-700' : 'text-slate-400'} />
                {!isCollapsed && <span>Edukasi AI</span>}
              </div>
              {!isCollapsed && <motion.div animate={{ rotate: isEdukasiOpen ? 180 : 0 }}><ChevronDown size={16} /></motion.div>}
            </button>
            <AnimatePresence>
              {isEdukasiOpen && !isCollapsed && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pl-9 pr-2 overflow-hidden space-y-1 mt-1">
                  <button onClick={() => setActiveTab('about-model')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'about-model' ? 'text-teal-700 bg-teal-50' : 'text-slate-500 hover:text-slate-800'}`}>Tentang Model AI</button>
                  <button onClick={() => setActiveTab('glossary')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'glossary' ? 'text-teal-700 bg-teal-50' : 'text-slate-500 hover:text-slate-800'}`}>Glosarium Gizi</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* BAGIAN BAWAH (FOOTER - TETAP FIX DIAM) */}
        <div className="p-3 border-t border-slate-100 space-y-1.5 bg-white flex-shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50/60 transition-all cursor-pointer"><LogOut size={20} /></button>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full flex items-center justify-center py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs font-bold">{isCollapsed ? <ChevronRight size={18} /> : <div className="flex items-center gap-2"><ChevronLeft size={18} /> Sembunyikan Menu</div>}</button>
        </div>
      </motion.div>

      {/* =========================================================
          PANEL UTAMA KONTEN DASHBOARD (SISI KANAN - SCROLL INDEPENDEN)
          ========================================================= */}
      <div className="flex-1 h-screen overflow-y-auto no-scrollbar">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          
          {/* HEADER ATAS */}
          <div className="flex justify-between items-center mb-8 pb-5 border-b border-slate-200/60">
            <div>
              <h1 className="text-2xl font-serif font-extrabold text-slate-900 uppercase tracking-tight">
                {activeTab === 'dashboard-utama' && "Pusat Kendali Informasi"}
                {activeTab === 'input-antropometri' && "Pencatatan Ukuran Anak"}
                {activeTab === 'cek-gizi' && "Cek Status Gizi Balita"}
                {activeTab === 'riwayat' && "Riwayat Tumbuh Kembang Anak"}
                {activeTab === 'imunisasi' && "Jadwal Imunisasi Nasional"}
                {activeTab === 'kalkulator-tinggi' && "Kalkulator Tinggi Genetik Anak"}
                {activeTab === 'milestone' && "Milestone Tumbuh Kembang (Buku KIA)"}
                {activeTab === 'teething' && "Tracker Pertumbuhan Gigi Anak"}
                {activeTab === 'about-model' && "Tentang Model Machine Learning"}
                {activeTab === 'glossary' && "Glosarium & Istilah Medis"}
                {activeTab === 'profil' && "Pengaturan Profil Keluarga"}
              </h1>
              <p className="text-sm text-slate-500 font-medium">Sistem Monitoring Tumbuh Kembang Terpadu</p>
            </div>

            <button 
              onClick={() => setActiveTab('profil')}
              className={`flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border transition-all shadow-sm cursor-pointer hover:border-teal-600 ${activeTab === 'profil' ? 'border-teal-600 bg-teal-50/20' : 'border-slate-200/70'}`}
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm"><User size={16} /></div>
              <span className="text-xs font-bold text-slate-700">{user?.identifier}</span>
            </button>
          </div>

          {/* SWITCHING CONTENT TABS */}
          <AnimatePresence mode="wait">
            
            {/* INTERACTIVE DASHBOARD VIEW */}
            {activeTab === 'dashboard-utama' && (
              <motion.div key="dashboard-utama" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                
                {/* BANNER UTAMA + INTERACTIVE CHILD SELECTOR */}
                <div className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-extrabold">Selamat Datang Kembali, Bunda! 👋</h2>
                    <p className="text-teal-50/80 text-xs md:text-sm max-w-xl leading-relaxed">
                      Sistem AI cerdas memonitor data klinis balita secara berkala sesuai standar WHO 2026.
                    </p>
                  </div>
                  
                  {/* PILIH ANAK SECARA INTERAKTIF */}
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-2 min-w-[200px]">
                    <span className="block text-[10px] font-bold text-teal-200 uppercase tracking-wider">Pilih Data Balita:</span>
                    <div className="relative">
                      <select 
                        value={selectedChild}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className="w-full bg-slate-900/40 text-white font-bold text-xs p-2.5 rounded-xl border border-white/20 focus:outline-none cursor-pointer appearance-none pr-8"
                      >
                        <option value="alif" className="text-slate-800 font-bold">👦 Muhammad Alif (24 Bln)</option>
                        <option value="alya" className="text-slate-800 font-bold">👧 Siti Alya (12 Bln)</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-3.5 pointer-events-none text-teal-200" />
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE METRICS GRID (DENGAN INDIKATOR TREN) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600"><Activity size={22} /></div>
                    <div className="flex-1">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase">Kondisi Anak</span>
                      <span className={`block text-xs font-extrabold mt-0.5 ${selectedChild === 'alif' ? 'text-emerald-600' : 'text-rose-500 animate-pulse'}`}>
                        {currentChild.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3 rounded-xl bg-teal-50 text-teal-600"><Scale size={22} /></div>
                    <div className="flex-1">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase">Berat Badan</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-slate-800">{currentChild.weight}</span>
                        <span className={`text-[10px] font-bold ${selectedChild === 'alif' ? 'text-emerald-500' : 'text-rose-400'}`}>{currentChild.weightTrend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3 rounded-xl bg-amber-50 text-amber-600"><Ruler size={22} /></div>
                    <div className="flex-1">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase">Tinggi Badan</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-slate-800">{currentChild.height}</span>
                        <span className="text-[10px] font-bold text-emerald-500">{currentChild.heightTrend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600"><BrainCircuit size={22} /></div>
                    <div className="flex-1">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase">Z-Score (Stunting)</span>
                      <span className="block text-xs font-extrabold text-slate-800 mt-0.5">{currentChild.zscore}</span>
                    </div>
                  </div>
                </div>

                {/* DUA KOLOM: GRAFIK INTERAKTIF & AI SMART INSIGHTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* KOLOM 1 & 2: GRAFIK TRACKER INTERAKTIF (SVG PURE) */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-800">Grafik 6 Bulan Terakhir</h3>
                        <p className="text-[11px] text-slate-400 font-medium">Klik tombol samping untuk menukar variabel visualisasi</p>
                      </div>
                      
                      {/* FILTER KLIK UNTUK SWITCH GRAFIK */}
                      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200/40">
                        <button 
                          onClick={() => setChartView('tinggi')}
                          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${chartView === 'tinggi' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-400'}`}
                        >
                          Tinggi (cm)
                        </button>
                        <button 
                          onClick={() => setChartView('berat')}
                          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${chartView === 'berat' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-400'}`}
                        >
                          Berat (kg)
                        </button>
                      </div>
                    </div>

                    {/* VISUALISASI MINI SVG CHART */}
                    <div className="h-48 w-full bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between relative border border-dashed border-slate-200">
                      <div className="absolute top-3 right-4 flex items-center gap-2 text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                        <TrendingUp size={12} /> Tren Meningkat
                      </div>
                      
                      {/* Ilustrasi Grafik Garis Menggunakan SVG */}
                      <div className="w-full flex-1 flex items-end justify-between px-6 pt-6">
                        {currentChild.chartData.map((val, idx) => {
                          // Kalkulasi tinggi bar simulasi secara dinamis
                          const baseHeight = chartView === 'tinggi' ? (val / 100) * 100 : (val / 15) * 100
                          return (
                            <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                              <motion.div 
                                initial={{ height: 0 }} 
                                animate={{ height: `${Math.min(baseHeight, 110)}px` }}
                                className="w-8 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg shadow-sm group-hover:from-emerald-500 group-hover:to-emerald-400 transition-colors flex items-top justify-center"
                              >
                                <span className="text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity -top-5 relative bg-slate-800 px-1 rounded">
                                  {val}
                                </span>
                              </motion.div>
                              <span className="text-[10px] text-slate-400 font-bold">Bln-{idx + 1}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* KOLOM 3: AI INSIGHTS & INTERACTIVE CHECKLIST */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-2">
                      <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                        <Sparkles size={16} className="text-teal-600 animate-pulse" /> AI Rekomendasi Gizi
                      </h3>
                    </div>

                    {/* Kotak Pesan Dinamis AI */}
                    <div className={`p-3.5 rounded-xl border text-[11px] leading-relaxed font-medium ${selectedChild === 'alif' ? 'bg-teal-50/40 border-teal-100 text-teal-900' : 'bg-rose-50/40 border-rose-100 text-rose-900'}`}>
                      <div className="flex items-start gap-2">
                        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                        <p>{currentChild.tips}</p>
                      </div>
                    </div>

                    {/* CHECKLIST INTERAKTIF TUGAS BUNDA */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Target Gizi Harian:</span>
                      <div className="space-y-1.5">
                        {checklistItems.map((item) => (
                          <label 
                            key={item.id} 
                            onClick={() => toggleChecklist(item.id)}
                            className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all text-[11px] font-bold text-slate-600"
                          >
                            <input 
                              type="checkbox" 
                              checked={item.checked}
                              onChange={() => {}} // di-handle via click label induk
                              className="accent-teal-700 w-3.5 h-3.5 cursor-pointer rounded" 
                            />
                            <span className={item.checked ? 'line-through text-slate-400 font-medium' : 'text-slate-700'}>
                              {item.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* PILIHAN MENU CEPAT (QUICK NAVIGATION BOXES) */}
                <div className="space-y-2">
                  <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Akses Pintas Fitur Utama:</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { title: "Input Antropometri", target: "input-antropometri", desc: "Catat tinggi & berat", color: "hover:border-teal-500" },
                      { title: "Cek Status Gizi", target: "cek-gizi", desc: "Kalkulasi model AI", color: "hover:border-emerald-500" },
                      { title: "Milestone KIA", target: "milestone", desc: "Checklist tumbuh kembang", color: "hover:border-indigo-500" },
                      { title: "Kalkulator Tinggi", target: "kalkulator-tinggi", desc: "Prediksi genetik masa depan", color: "hover:border-amber-500" },
                    ].map((btn, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveTab(btn.target)}
                        className={`bg-white p-4 text-left border border-slate-200/80 rounded-2xl cursor-pointer transition-all shadow-sm ${btn.color} group`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="block text-xs font-extrabold text-slate-800 group-hover:text-teal-700 transition-colors">{btn.title}</span>
                          <ArrowUpRight size={14} className="text-slate-300 group-hover:text-teal-600 transition-colors" />
                        </div>
                        <span className="block text-[10px] text-slate-400 font-medium mt-1">{btn.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
            
            {/* RENDER HALAMAN-HALAMAN KITA */}
            {activeTab === 'input-antropometri' && <motion.div key="input-antropometri" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PaperWrapper><AnthropometryInputPage onNextStep={setActiveTab} /></PaperWrapper></motion.div>}
            {activeTab === 'cek-gizi' && <motion.div key="cek-gizi" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ClassifierPage /></motion.div>}
            {activeTab === 'riwayat' && <motion.div key="riwayat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><GrowthHistoryPage /></motion.div>}
            {activeTab === 'imunisasi' && <motion.div key="imunisasi" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PaperWrapper><ImmunizationSchedulePage /></PaperWrapper></motion.div>}
            {activeTab === 'kalkulator-tinggi' && <motion.div key="kalkulator-tinggi" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PaperWrapper><HeightPredictorPage /></PaperWrapper></motion.div>}
            {activeTab === 'about-model' && <motion.div key="about-model" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><AboutModelPage /></motion.div>}
            {activeTab === 'glossary' && <motion.div key="glossary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><GlossaryPage /></motion.div>}
            {activeTab === 'milestone' && <motion.div key="milestone" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PaperWrapper><MilestonePage /></PaperWrapper></motion.div>}
            {activeTab === 'teething' && <motion.div key="teething" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PaperWrapper><TeethingTrackerPage /></PaperWrapper></motion.div>}
            
            {/* TAB BARU: HALAMAN PROFIL KELUARGA */}
            {activeTab === 'profil' && <motion.div key="profil" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}><PaperWrapper><ProfilePage /></PaperWrapper></motion.div>}

          </AnimatePresence>
        </div>
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