import { createContext, useState, useEffect, useContext } from 'react';

// 1. Membuat wadah Context
const AuthContext = createContext();

// 2. Membuat Provider (Penyedia Data) untuk dibungkus ke seluruh aplikasi
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efek ini berjalan sekali saat web pertama kali dimuat
  // Tujuannya untuk mengecek apakah sebelumnya Bunda sudah login
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Selesai mengecek
  }, []);

  // Fungsi untuk masuk (Login)
  const signIn = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  // Fungsi untuk keluar (Logout)
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Menyalurkan data 'user' dan fungsi 'signIn' / 'signOut' ke seluruh halaman
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Membuat Hook khusus (useAuth) agar mudah dipanggil di file lain (seperti di Navbar)
export function useAuth() {
  return useContext(AuthContext);
}