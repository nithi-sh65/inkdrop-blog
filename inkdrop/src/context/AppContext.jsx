import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('inkdrop_history')) || [] } catch { return [] }
  })
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('inkdrop_bookmarks')) || [] } catch { return [] }
  })

  const addHistory = (post) => {
    setHistory(prev => {
      const filtered = prev.filter(p => p.id !== post.id)
      const updated = [{ ...post, visitedAt: new Date().toISOString() }, ...filtered].slice(0, 30)
      localStorage.setItem('inkdrop_history', JSON.stringify(updated))
      return updated
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('inkdrop_history')
  }

  const toggleBookmark = (post) => {
    setBookmarks(prev => {
      const exists = prev.find(p => p.id === post.id)
      const updated = exists ? prev.filter(p => p.id !== post.id) : [{ ...post, savedAt: new Date().toISOString() }, ...prev]
      localStorage.setItem('inkdrop_bookmarks', JSON.stringify(updated))
      return updated
    })
  }

  const isBookmarked = (id) => bookmarks.some(p => p.id === id)

  return (
    <AppContext.Provider value={{ history, addHistory, clearHistory, bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
