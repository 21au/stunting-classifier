import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Email atau password salah.' : error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
        <h1 className="font-display text-2xl font-semibold mb-1">Masuk</h1>
        <p className="text-muted text-sm mb-6">Masuk untuk mengakses fitur lengkap.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted font-medium">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-sage rounded-lg px-3 py-2 focus:outline-none focus:border-teal" />
          </div>
          <div>
            <label className="text-sm text-muted font-medium">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border border-sage rounded-lg px-3 py-2 focus:outline-none focus:border-teal" />
          </div>
          {error && <p className="text-coral text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-teal text-white rounded-lg py-2.5 font-medium flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-5">
          Belum punya akun? <Link to="/daftar" className="text-teal font-medium hover:underline">Daftar</Link>
        </p>
      </motion.div>
    </div>
  )
}