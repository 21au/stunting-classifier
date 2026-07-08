import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ClassifierPage from './pages/ClassifierPage'
import AboutModelPage from './pages/AboutModelPage'
import GlossaryPage from './pages/GlossaryPage'
import GrowthHistoryPage from './pages/GrowthHistoryPage'

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
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App