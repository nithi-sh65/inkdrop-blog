import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const ACCENTS = ['#8b5cf6','#ec4899','#06b6d4','#f59e0b','#10b981','#f97316']

export default function PostCard({ post, user, index=0 }) {
  const { toggleBookmark, isBookmarked } = useApp()
  const { user:authUser, showToast } = useAuth()
  const accent = ACCENTS[post.userId % ACCENTS.length]
  const saved = isBookmarked(post.id)
  const readTime = Math.max(1, Math.ceil(post.body.split(' ').length / 200))

  const handleBookmark = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!authUser) { showToast('Sign in to save posts!','error'); return }
    toggleBookmark(post)
    showToast(saved ? 'Removed from bookmarks' : '🔖 Saved to bookmarks!')
  }

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: Math.min(index*0.05, 0.4), duration:0.4 }}
      whileHover={{ y:-6 }}>
      <Link to={`/posts/${post.id}`} style={{ display:'block', height:'100%' }}>
        <div style={{
          height:'100%', padding:'1.5rem', borderRadius:16,
          background:'rgba(255,255,255,0.04)',
          border:`1px solid rgba(255,255,255,0.07)`,
          borderTop:`3px solid ${accent}`,
          transition:'border-color .2s, box-shadow .2s',
          position:'relative', overflow:'hidden',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=accent; e.currentTarget.style.boxShadow=`0 12px 40px ${accent}30` }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none' }}>

          {/* Subtle bg glow */}
          <div style={{ position:'absolute', top:-40, right:-40, width:120, height:120, borderRadius:'50%', background:`${accent}18`, filter:'blur(30px)', pointerEvents:'none' }}/>

          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.8rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:'50%', background:`linear-gradient(135deg,${accent},${accent}88)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff' }}>
                {post.userId}
              </div>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:accent }}>{user?.name?.split(' ')[0] || `User ${post.userId}`}</p>
                <p style={{ fontSize:10, color:'var(--muted)' }}>📖 {readTime} min read</p>
              </div>
            </div>
            <motion.button whileTap={{ scale:0.85 }} onClick={handleBookmark}
              style={{ background:'none', border:'none', fontSize:16, opacity:saved?1:0.4, transition:'opacity .2s, transform .2s', cursor:'pointer' }}>
              {saved ? '🔖' : '🏷️'}
            </motion.button>
          </div>

          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, lineHeight:1.35, marginBottom:'0.6rem', color:'#f1f5f9', textTransform:'capitalize', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {post.title}
          </h2>
          <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.7, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {post.body}
          </p>

          <div style={{ marginTop:'1rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:11, fontWeight:700, color:accent, letterSpacing:'.05em' }}>READ MORE →</span>
            <span style={{ fontSize:10, color:'var(--muted)', background:'rgba(255,255,255,.06)', padding:'2px 8px', borderRadius:20 }}>#{post.id}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
