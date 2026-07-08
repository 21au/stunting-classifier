import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/cek', label: 'Cek Status Gizi' },
  { to: '/tentang-model', label: 'Tentang Model' },
  { to: '/panduan-istilah', label: 'Panduan Istilah' },
  { to: '/riwayat-pertumbuhan', label: 'Riwayat Pertumbuhan' },
]

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-sage sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 font-display font-semibold text-ink text-lg"
        >
          <Activity size={20} className="text-teal" />
          Status Gizi AI
        </motion.div>

        <div className="flex gap-1 flex-wrap">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-ink hover:bg-sage/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-teal rounded-lg -z-10"
                      transition={{ type: 'spring', duration: 0.4 }}
                    />
                  )}
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}