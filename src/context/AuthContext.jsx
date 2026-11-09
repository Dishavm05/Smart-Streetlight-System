import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Demo account for Step 1. In Step 2 we replace this with Firebase Authentication.
const DEMO_EMAIL = 'admin@streetlight.com'
const DEMO_PASSWORD = 'admin123'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sl_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email, password) => {
    await new Promise((r) => setTimeout(r, 600)) // fake network delay
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const u = { email, name: 'Administrator' }
      localStorage.setItem('sl_user', JSON.stringify(u))
      setUser(u)
      return { ok: true }
    }
    return { ok: false, message: 'Email or password is incorrect.' }
  }

  const logout = () => {
    localStorage.removeItem('sl_user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
