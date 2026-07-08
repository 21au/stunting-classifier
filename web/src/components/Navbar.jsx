import { NavLink } from 'react-router-dom'
import { Activity } from 'lucide-react'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-teal text-white' : 'text-ink hover:bg-sage'
    }`

  return (
    <nav className="bg-white border-b border-sage sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-semibold text-ink">
          <Activity size={20} className="text-teal" />
          Status Gizi AI
        </div>
        <div className="flex gap-1">
          <NavLink to="/" end className={linkClass}>Beranda</NavLink>
          <NavLink to="/cek" className={linkClass}>Cek Status Gizi</NavLink>
          <NavLink to="/tentang-model" className={linkClass}>Tentang Model</NavLink>
          <NavLink to="/panduan-istilah" className={linkClass}>Panduan Istilah</NavLink>
        </div>
      </div>
    </nav>
  )
}