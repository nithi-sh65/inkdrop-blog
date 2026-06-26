import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function Bookmarks() {
  const { bookmarks, toggleBookmark } = useApp()
  const { showToast } = useAuth()

  const handleRemove = (e, post) => {
    e.preventDefault(); e.stopPropagation()
    toggleBookmark(post)
    showToast('Removed from bookmarks')
  }

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'2.5rem 1.5rem', position:'relative', zIndex:1 }}>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', fontWeight:900 }}>🔖 Bookmarks</h1>
        <p style={{ color:'var(--muted)', fontSize:14, marginTop:4 }}>{bookmarks.length} saved posts</p>
      </div>

      {bookmarks.length === 0 ? (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          style={{ textAlign:'center', padding:'5rem 2rem', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', borderRadius:20 }}>
          <p style={{ fontSize:56 }}>🔖</p>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, marginTop:16, marginBottom:8 }}>No bookmarks yet</p>
          <p style={{ color:'var(--muted)', fontSize:14, marginBottom:24 }}>Click 🏷️ on any post to save it here</p>
          <Link to="/" className="glow-btn" style={{ display:'inline-block', padding:'12px 28px' }}>Browse Posts →</Link>
        </motion.div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
          <AnimatePresence>
            {bookmarks.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.9 }} transition={{ delay:i*0.05 }}>
                <Link to={`/posts/${post.id}`} style={{ display:'block' }}>
                  <div style={{ padding:'1.25rem', borderRadius:14, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderLeft:'3px solid #8b5cf6', position:'relative', transition:'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(139,92,246,.5)'; e.currentTarget.style.background='rgba(139,92,246,.07)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,.07)'; e.currentTarget.style.background='rgba(255,255,255,.04)' }}>
                    <motion.button whileTap={{ scale:.85 }} onClick={(e) => handleRemove(e, post)}
                      style={{ position:'absolute', top:10, right:10, background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', color:'#f87171', borderRadius:8, padding:'4px 8px', fontSize:11, fontWeight:700 }}>
                      ✕ Remove
                    </motion.button>
                    <p style={{ fontSize:11, color:'#a78bfa', fontWeight:700, marginBottom:6 }}>🔖 Saved {formatDate(post.savedAt)}</p>
                    <p style={{ fontWeight:700, fontSize:14, textTransform:'capitalize', lineHeight:1.4, marginBottom:6, paddingRight:64 }}>{post.title}</p>
                    <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{post.body}</p>
                    <p style={{ fontSize:12, color:'#a78bfa', fontWeight:600, marginTop:10 }}>Read post →</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
