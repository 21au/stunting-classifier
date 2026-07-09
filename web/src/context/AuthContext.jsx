import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Ambil sesi login yang tersimpan di memori browser
    const savedUser = localStorage.getItem('user_session')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    // 2. Bikin database lokal di browser (Sama persis dengan data Neon Bunda)
    const existingUsers = localStorage.getItem('mock_users')
    if (!existingUsers) {
      const defaultUsers = [
        { identifier: 'audrey@gmail.com', password: 'audrey123' }, // Sesuai image_57aec1.png
        { identifier: '08123456789', password: 'rahasia123' }
      ]
      localStorage.setItem('mock_users', JSON.stringify(defaultUsers))
    }
    
    setLoading(false)
  }, [])

  // Fungsi Masuk (Login)
  async function signIn(identifier, password) {
    // Efek loading animasi 0.6 detik biar estetik profesional
    await new Promise(resolve => setTimeout(resolve, 600))

    const localUsers = JSON.parse(localStorage.getItem('mock_users') || '[]')
    
    // Cari akun yang cocok
    const foundUser = localUsers.find(
      u => u.identifier === identifier && u.password === password
    )

    if (!foundUser) {
      return { error: { message: 'Email/No. HP atau password salah, Bunda.' } }
    }

    // Jika sukses, simpan ke session browser
    const sessionUser = { identifier: foundUser.identifier }
    localStorage.setItem('user_session', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { error: null }
  }

  // Fungsi Daftar (Register)
  async function signUp(identifier, password) {
    await new Promise(resolve => setTimeout(resolve, 600))
    const localUsers = JSON.parse(localStorage.getItem('mock_users') || '[]')
    
    const isExist = localUsers.some(u => u.identifier === identifier)
    if (isExist) {
      return { error: { message: 'Email atau Nomor HP ini sudah terdaftar, Bunda.' } }
    }

    // Masukkan ke database lokal browser
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
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}