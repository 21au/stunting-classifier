import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ClassifierPage from './pages/ClassifierPage'
import AboutModelPage from './pages/AboutModelPage'
import GlossaryPage from './pages/GlossaryPage'
import GrowthHistoryPage from './pages/GrowthHistoryPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

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
        <Route path="/masuk" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/daftar" element={<PageWrapper><SignupPage /></PageWrapper>} />

        <Route path="/tentang-model" element={
          <ProtectedRoute><PageWrapper><AboutModelPage /></PageWrapper></ProtectedRoute>
        } />
        <Route path="/panduan-istilah" element={
          <ProtectedRoute><PageWrapper><GlossaryPage /></PageWrapper></ProtectedRoute>
        } />
        <Route path="/riwayat-pertumbuhan" element={
          <ProtectedRoute><PageWrapper><GrowthHistoryPage /></PageWrapper></ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <AnimatedRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App