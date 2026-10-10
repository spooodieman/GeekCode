import { createContext, useContext, useState, type ReactNode } from 'react'
import axios from 'axios'

interface User { username: string; email: string }
interface AuthCtx {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('gc_token'))

  const login = async (email: string, password: string) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('gc_token', data.token)
    setToken(data.token)
    setUser({ username: data.username, email })
  }

  const register = async (username: string, email: string, password: string) => {
    const { data } = await axios.post('/api/auth/register', { username, email, password })
    localStorage.setItem('gc_token', data.token)
    setToken(data.token)
    setUser({ username: data.username, email })
  }

  const logout = () => {
    localStorage.removeItem('gc_token')
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}