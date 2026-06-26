import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function History() {
  const { history, clearHistory } = useApp()
  const { showToast } = useAuth()

  const handleClear = () => { clearHistory(); showToast('Reading history cleared!') }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
  }

  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:'2.5rem 1.5rem', position:'relative', zIndex:1 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', fontWeight:900 }}>🕘 Reading History</h1>
          <p style={{ color:'var(--muted)', fontSize:14, marginTop:4 }}>Posts you've visited — saved locally in your browser</p>
        </div>
        {history.length > 0 && (
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:.96 }} onClick={handleClear}
            style={{ padding:'10px 20px', borderRadius:10, background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', color:'#f87171', fontWeight:600, fontSize:13 }}>
            🗑️ Clear All
          </motion.button>
        )}
      </div>

      {history.length === 0 ? (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          style={{ textAlign:'center', padding:'5rem 2rem', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', borderRadius:20 }}>
          <p style={{ fontSize:56 }}>📭</p>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, marginTop:16, marginBottom:8 }}>No history yet</p>
          <p style={{ color:'var(--muted)', fontSize:14, marginBottom:24 }}>Start reading posts and they'll appear here</p>
          <Link to="/" className="glow-btn" style={{ display:'inline-block', padding:'12px 28px' }}>Browse Posts →</Link>
        </motion.div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <AnimatePresence>
            {history.map((post, i) => (
              <motion.div key={`${post.id}-${post.visitedAt}`}
                initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}
                transition={{ delay:i*0.04 }}>
                <Link to={`/posts/${post.id}`} style={{ display:'block' }}>
                  <div style={{ padding:'1rem 1.25rem', borderRadius:14, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:16, transition:'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(139,92,246,.4)'; e.currentTarget.style.background='rgba(139,92,246,.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,.07)'; e.currentTarget.style.background='rgba(255,255,255,.04)' }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:'rgba(139,92,246,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>📄</div>
                    <div style={{ flex:1, overflow:'hidden' }}>
                      <p style={{ fontWeight:700, fontSize:14, textTransform:'capitalize', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{post.title}</p>
                      <p style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>🕘 {formatDate(post.visitedAt)}</p>
                    </div>
                    <span style={{ fontSize:12, color:'#a78bfa', fontWeight:600, flexShrink:0 }}>Read →</span>
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
