import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar' // Sesuaikan jika letak navbar lama di sini
import { Loader2 } from 'lucide-react'

// =========================================================================
// RUTE PEMBATAS (ROUTE GUARD)
// =========================================================================

// Halaman yang hanya boleh diakses setelah LOGIN
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return user ? children : <Navigate to="/masuk" replace />
}

// Halaman publik (seperti Landing Page, Login, Daftar)
function PublicRoute({ children, showNavbar = true }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  
  // Jika sudah login dan mencoba akses landing page / login / daftar, 
  // langsung lempar masuk ke dalam Dashboard Utama
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-teal-700" size={32} />
    </div>
  )
}

// Component Landing Page Lama Bunda (Sebagai Placeholder jika belum login)
function DummyLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-2xl">
        <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-100">AI-Powered Growth Screening</span>
        <h1 className="text-4xl font-serif font-extrabold text-slate-900 mt-4 mb-3">Deteksi Dini Masalah Gizi Balita Dengan Machine Learning</h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">Jangan tunggu sampai gejala fisik terlihat terlambat. Lindungi masa depan buah hati melalui pemantauan digital.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          {/* 1. JALUR BELUM LOGIN (GUEST) */}
          {/* Jika belum masuk, tampilkan Landing Page + Navbar Atas */}
          <Route path="/" element={
            <PublicRoute showNavbar={true}>
              <DummyLandingPage /> 
            </PublicRoute>
          } />
          
          <Route path="/masuk" element={
            <PublicRoute showNavbar={false}>
              <LoginPage />
            </PublicRoute>
          } />
          
          <Route path="/daftar" element={
            <PublicRoute showNavbar={false}>
              <SignupPage />
            </PublicRoute>
          } />

          {/* 2. JALUR SUDAH LOGIN (PROTECTED) */}
          {/* Masuk ke Dashboard Samping yang bersih tanpa Navbar Atas */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          {/* Cegah alamat nyasar, kembalikan ke beranda */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  )
}