import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = [
  { id:1, name:'Minnie mouse', username:'Minnie mouse', password:'Minnie mouse123', email:'Minniemouse@inkdrop.com', avatar:'MM', role:'Admin' },
  { id:2, name:'Demo User', username:'demo', password:'demo123', email:'demo@inkdrop.com', avatar:'DU', role:'Reader' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('inkdrop_user')) } catch { return null }
  })
  const [toast, setToast] = useState(null)

  const showToast = (msg, type='success') => {
    setToast({ msg, type, id: Date.now() })
    setTimeout(() => setToast(null), 3500)
  }

  const login = (username, password) => {
    const found = DEMO_USERS.find(u => u.username === username && u.password === password)
    if (found) {
      const { password: _, ...safe } = found
      setUser(safe)
      localStorage.setItem('inkdrop_user', JSON.stringify(safe))
      showToast(`Welcome back, ${safe.name}! 👋`)
      return true
    }
    showToast('Invalid credentials. Try Minnie mouse / Minnie mouse123', 'error')
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('inkdrop_user')
    showToast('Logged out. See you soon!')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, toast, showToast }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
