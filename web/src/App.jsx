import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ClassifierPage from './pages/ClassifierPage'
import AboutModelPage from './pages/AboutModelPage'
import GlossaryPage from './pages/GlossaryPage'
import GrowthHistoryPage from './pages/GrowthHistoryPage'

// IMPORT DUA HALAMAN BARU DI SINI (Pastikan nanti Bunda buat filenya di folder pages ya!)
import ImmunizationSchedulePage from './pages/ImmunizationSchedulePage'
import HeightPredictorPage from './pages/HeightPredictorPage'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/cek" element={<PageWrapper><ClassifierPage /></PageWrapper>} />
        <Route path="/tentang-model" element={<PageWrapper><AboutModelPage /></PageWrapper>} />
        <Route path="/panduan-istilah" element={<PageWrapper><GlossaryPage /></PageWrapper>} />
        <Route path="/riwayat-pertumbuhan" element={<PageWrapper><GrowthHistoryPage /></PageWrapper>} />
        
        {/* RUTE BARU SEJAJAR DENGAN MENU NAVBAR */}
        <Route path="/jadwal-imunisasi" element={<PageWrapper><ImmunizationSchedulePage /></PageWrapper>} />
        <Route path="/kalkulator-tinggi-genetik" element={<PageWrapper><HeightPredictorPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App