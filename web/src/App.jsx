import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ClassifierPage from './pages/ClassifierPage'
import AboutModelPage from './pages/AboutModelPage'
import GlossaryPage from './pages/GlossaryPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cek" element={<ClassifierPage />} />
          <Route path="/tentang-model" element={<AboutModelPage />} />
          <Route path="/panduan-istilah" element={<GlossaryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App