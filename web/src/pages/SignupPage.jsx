import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Loader2, UserCheck, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const [identifier, setIdentifier] = useState('') // Mengganti email jadi identifier (Bisa email / No.HP)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signUp, signIn } = useAuth() 
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (password.length < 6) {
      setError('Password minimal 6 karakter ya, Bunda.')
      setLoading(false)
      return
    }
    
    // 1. PROSES DAFTAR (Kirim identifier ke backend Bunda)
    const { error: signUpError } = await signUp(identifier, password)
    
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    } 

    // 2. PROSES OTOMATIS LOGIN
    const { error: signInError } = await signIn(identifier, password)
    
    if (signInError) {
      setLoading(false)
      navigate('/masuk')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-teal-50/50 rounded-full blur-3xl -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-xl max-w-md w-full rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-extrabold text-slate-900 mb-2">Daftar Akun</h1>
          <p className="text-slate-500 text-sm">Gunakan Email atau Nomor HP aktif Bunda.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* INPUT IDENTIFIER (EMAIL / NO HP) */}
          <div>
            <label className="text-sm text-slate-700 font-bold mb-1.5 block">Email atau No. Handphone</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                <UserCheck size={18} />
              </div>
              <input 
                type="text" 
                required 
                placeholder="bunda@email.com / 08123456xxx"
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300" 
              />
            </div>
          </div>

          {/* INPUT PASSWORD */}
          <div>
            <label className="text-sm text-slate-700 font-bold mb-1.5 block">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="Minimal 6 karakter"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-teal-700 text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-teal-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-700/30 active:scale-95 transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Mendaftarkan...</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Daftar & Masuk</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Sudah punya akun?{' '}
            <Link to="/masuk" className="text-teal-700 font-bold hover:text-teal-600 hover:underline transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}