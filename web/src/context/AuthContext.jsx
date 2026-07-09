import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Cek apakah ada user yang sedang login di komputer ini
    const savedUser = localStorage.getItem('user_session')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    // 2. Bikin akun tiruan default di komputer ini kalau belum ada datanya
    const existingUsers = localStorage.getItem('mock_users')
    if (!existingUsers) {
      const defaultUsers = [
        { identifier: 'bunda@email.com', password: 'rahasia123' },
        { identifier: '08123456789', password: 'rahasia123' }
      ]
      localStorage.setItem('mock_users', JSON.stringify(defaultUsers))
    }
    
    setLoading(false)
  }, [])

  // Fungsi Masuk (Login) - INSTAN & MANDIRI
  async function signIn(identifier, password) {
    // Beri efek loading palsu sebentar (0.5 detik) biar estetik
    await new Promise(resolve => setTimeout(resolve, 500))

    const localUsers = JSON.parse(localStorage.getItem('mock_users') || '[]')
    
    // Cari apakah email/no hp dan password-nya cocok
    const foundUser = localUsers.find(
      u => u.identifier === identifier && u.password === password
    )

    if (!foundUser) {
      return { error: { message: 'Email/No. HP atau password salah, Bunda.' } }
    }

    // Jika cocok, simpan sesi
    const sessionUser = { identifier: foundUser.identifier }
    localStorage.setItem('user_session', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { error: null }
  }

  // Fungsi Daftar (Register) - LANGSUNG MASUK KE STORAGE KOMPUTER
  async function signUp(identifier, password) {
    await new Promise(resolve => setTimeout(resolve, 500))

    const localUsers = JSON.parse(localStorage.getItem('mock_users') || '[]')
    
    // Cek apakah sudah terdaftar
    const isExist = localUsers.some(u => u.identifier === identifier)
    if (isExist) {
      return { error: { message: 'Email atau Nomor HP ini sudah terdaftar, Bunda.' } }
    }

    // Daftarkan user baru ke list lokal
    localUsers.push({ identifier, password })
    localStorage.setItem('mock_users', JSON.stringify(localUsers))

    return { error: null }
  }

  // Fungsi Keluar (Logout)
  function signOut() {
    localStorage.removeItem('user_session')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}