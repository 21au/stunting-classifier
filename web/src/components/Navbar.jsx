import { useAuth } from '../context/AuthContext'
import { LogOut, LogIn, ArrowLeft, Activity, ChevronDown, CheckCircle2, History, BookOpen, BrainCircuit, CalendarDays, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isEdukasiActive = location.pathname === '/tentang-model' || location.pathname === '/panduan-istilah';

  useEffect(() => {
    setOpenDropdown(null);
  }, [location]);

  // =========================================================================
  // CONDITION 1: TAMPILAN KHUSUS HALAMAN CEK GIZI (BELUM LOGIN)
  // =========================================================================
  if (!user && location.pathname === '/cek') {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 text-slate-500 hover:text-teal-700 transition-colors active:scale-95 duration-200"
          >
            <div className="p-1.5 bg-slate-100 hover:bg-teal-50 rounded-lg transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="font-bold text-sm">Kembali ke Beranda</span>
          </NavLink>

          <div className="flex items-center gap-2 font-serif font-extrabold text-slate-200 text-lg tracking-tight select-none pointer-events-none">
            <Activity size={20} />
            <span>Status Gizi AI</span>
          </div>
        </div>
      </nav>
    );
  }

  // =========================================================================
  // CONDITION 2: TAMPILAN UTAMA (AESTHETIC & INTERAKTIF)
  // =========================================================================
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between flex-wrap gap-4">
        
        {/* LOGO BRAND */}
        <NavLink to="/" className="flex items-center gap-2 font-serif font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight hover:opacity-80 transition-opacity active:scale-95 duration-200">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 rounded-xl border border-teal-100 text-teal-700">
              <Activity size={20} />
            </div>
            <span>Status Gizi <span className="text-teal-700">AI</span></span>
          </motion.div>
        </NavLink>

        {/* CONTAINER KANAN: MENU LINKS & AUTH BUTTONS */}
        <div className="flex items-center gap-1.5 flex-wrap">
          
          <div className="flex items-center gap-1.5 relative">
            
            {/* MENU 1: SELALU MUNCUL (Kecuali kalau sudah login, tetap ada) */}
            <NavLink
              to="/cek"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ease-out flex items-center gap-1.5 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                  isActive ? 'text-teal-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div layoutId="navbar-active-pill" className="absolute inset-0 bg-teal-50 rounded-xl border border-teal-100/70 -z-10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                  <CheckCircle2 size={16} className={isActive ? "text-teal-700" : "text-slate-400"} />
                  Cek Status Gizi
                </>
              )}
            </NavLink>

            {/* KUMPULAN MENU PROTECTED: HANYA MUNCUL JIKA USER BENAR-BENAR ADA */}
            {user && (
              <>
                {/* MENU 2: RIWAYAT PERTUMBUHAN */}
                <NavLink
                  to="/riwayat-pertumbuhan"
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ease-out flex items-center gap-1.5 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                      isActive ? 'text-teal-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div layoutId="navbar-active-pill" className="absolute inset-0 bg-teal-50 rounded-xl border border-teal-100/70 -z-10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                      )}
                      <History size={16} className={isActive ? "text-teal-700" : "text-slate-400"} />
                      Riwayat Pertumbuhan
                    </>
                  )}
                </NavLink>

                {/* MENU 3: JADWAL IMUNISASI */}
                <NavLink
                  to="/jadwal-imunisasi"
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ease-out flex items-center gap-1.5 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                      isActive ? 'text-teal-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div layoutId="navbar-active-pill" className="absolute inset-0 bg-teal-50 rounded-xl border border-teal-100/70 -z-10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                      )}
                      <CalendarDays size={16} className={isActive ? "text-teal-700" : "text-slate-400"} />
                      Jadwal Imunisasi
                    </>
                  )}
                </NavLink>

                {/* MENU 4: PREDIKSI TINGGI */}
                <NavLink
                  to="/kalkulator-tinggi-genetik"
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ease-out flex items-center gap-1.5 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                      isActive ? 'text-teal-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div layoutId="navbar-active-pill" className="absolute inset-0 bg-teal-50 rounded-xl border border-teal-100/70 -z-10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                      )}
                      <Sparkles size={16} className={isActive ? "text-amber-600" : "text-slate-400"} />
                      Prediksi Tinggi
                    </>
                  )}
                </NavLink>

                {/* MENU 5: DROPDOWN EDUKASI */}
                <div className="relative" onMouseEnter={() => setOpenDropdown('edukasi')} onMouseLeave={() => setOpenDropdown(null)}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'edukasi' ? null : 'edukasi')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ease-out flex items-center gap-1 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                      isEdukasiActive ? 'bg-teal-700 text-white shadow-md shadow-teal-700/10' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>Edukasi AI</span>
                    <motion.div animate={{ rotate: openDropdown === 'edukasi' ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openDropdown === 'edukasi' && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15, ease: "easeOut" }} className="absolute right-0 mt-2 w-64 bg-white border border-slate-200/70 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1">
                        <NavLink to="/panduan-istilah" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><BookOpen size={16} /></div>
                          <div>
                            <span className="block font-bold">Panduan Istilah Gizi</span>
                            <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">Kamus simpel untuk Bunda</span>
                          </div>
                        </NavLink>
                        <NavLink to="/tentang-model" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600"><BrainCircuit size={16} /></div>
                          <div>
                            <span className="block font-bold">Tentang Sistem AI</span>
                            <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">Cara kerja Machine Learning</span>
                          </div>
                        </NavLink>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          <div className="hidden md:block w-px h-6 bg-slate-200 mx-2"></div>

          {/* SECTION TOMBOL AUTH KANAN */}
          <div className="flex items-center gap-2">
            {user ? (
              <button onClick={signOut} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 transition-all duration-300 ease-out cursor-pointer">
                <LogOut size={16} /> Keluar
              </button>
            ) : (
              <>
                <NavLink to="/masuk" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 transition-all duration-300 ease-out">
                  <LogIn size={16} /> Masuk
                </NavLink>
                <NavLink to="/daftar" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-teal-700 text-white hover:bg-teal-600 hover:-translate-y-0.5 hover:shadow-md hover:shadow-teal-700/30 active:scale-95 transition-all duration-300 ease-out">
                  Daftar
                </NavLink>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}