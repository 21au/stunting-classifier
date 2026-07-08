import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  ChevronDown, 
  CheckCircle2, 
  History, 
  BookOpen, 
  BrainCircuit, 
  CalendarDays, 
  Sparkles 
} from 'lucide-react'

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null); // 'gizi' atau 'edukasi' atau null
  const location = useLocation();

  // Deteksi halaman aktif untuk masing-masing grup dropdown
  const isGiziActive = location.pathname === '/cek' || location.pathname === '/riwayat-pertumbuhan';
  const isEdukasiActive = location.pathname === '/tentang-model' || location.pathname === '/panduan-istilah';

  // Otomatis tutup semua dropdown saat pengguna pindah halaman
  useEffect(() => {
    setOpenDropdown(null);
  }, [location]);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between flex-wrap gap-4">
        
        {/* LOGO BRAND */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 font-serif font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight"
        >
          <div className="p-2 bg-teal-50 rounded-xl border border-teal-100 text-teal-700">
            <Activity size={20} />
          </div>
          <span>Status Gizi <span className="text-teal-700">AI</span></span>
        </motion.div>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-1.5 flex-wrap relative">
          
          {/* 1. MENU: BERANDA */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive ? 'text-teal-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-teal-50 rounded-xl border border-teal-100/70 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                Beranda
              </>
            )}
          </NavLink>

          {/* 2. DROPDOWN GROUP: PANTAU GIZI ANAK */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenDropdown('gizi')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              onClick={() => setOpenDropdown(openDropdown === 'gizi' ? null : 'gizi')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                isGiziActive 
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/10' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>Pantau Gizi</span>
              <motion.div
                animate={{ rotate: openDropdown === 'gizi' ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>

            <AnimatePresence>
              {openDropdown === 'gizi' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 mt-2 w-60 bg-white border border-slate-200/70 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1"
                >
                  <NavLink
                    to="/cek"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <span className="block font-bold">Cek Status Gizi</span>
                      <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">Kalkulator Z-score AI</span>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/riwayat-pertumbuhan"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                      <History size={16} />
                    </div>
                    <div>
                      <span className="block font-bold">Riwayat Pertumbuhan</span>
                      <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">Grafik & Tren berkala</span>
                    </div>
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. MENU MANDIRI ⭐ Fitur 2: JADWAL IMUNISASI */}
          <NavLink
            to="/jadwal-imunisasi"
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                isActive ? 'text-teal-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-teal-50 rounded-xl border border-teal-100/70 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <CalendarDays size={16} className={isActive ? "text-teal-700" : "text-slate-400"} />
                Jadwal Imunisasi
              </>
            )}
          </NavLink>

          {/* 4. MENU MANDIRI ⭐ Fitur 4: PREDIKSI TINGGI */}
          <NavLink
            to="/kalkulator-tinggi-genetik"
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                isActive ? 'text-teal-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-teal-50 rounded-xl border border-teal-100/70 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Sparkles size={16} className={isActive ? "text-amber-600" : "text-slate-400"} />
                Prediksi Tinggi
              </>
            )}
          </NavLink>

          {/* 5. DROPDOWN GROUP: PUSAT EDUKASI (MODEL & ISTILAH) */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenDropdown('edukasi')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              onClick={() => setOpenDropdown(openDropdown === 'edukasi' ? null : 'edukasi')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                isEdukasiActive 
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/10' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>Edukasi AI</span>
              <motion.div
                animate={{ rotate: openDropdown === 'edukasi' ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>

            <AnimatePresence>
              {openDropdown === 'edukasi' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-200/70 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1"
                >
                  <NavLink
                    to="/panduan-istilah"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <span className="block font-bold">Panduan Istilah Gizi</span>
                      <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">Kamus simpel untuk Bunda</span>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/tentang-model"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
                      <BrainCircuit size={16} />
                    </div>
                    <div>
                      <span className="block font-bold">Tentang Sistem AI</span>
                      <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">Cara kerja Machine Learning</span>
                    </div>
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </nav>
  )
}