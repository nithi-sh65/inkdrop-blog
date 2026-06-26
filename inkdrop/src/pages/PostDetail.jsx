import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { Spinner, ErrorBox } from '../components/Loader'

const ACCENTS = ['#8b5cf6','#ec4899','#06b6d4','#f59e0b','#10b981','#f97316']

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addHistory, toggleBookmark, isBookmarked } = useApp()
  const { user:authUser, showToast } = useAuth()

  useEffect(() => {
    setLoading(true)
    api.getPost(id)
      .then(async p => {
        setPost(p)
        addHistory(p)
        const [c, u] = await Promise.all([api.getComments(id), api.getUser(p.userId)])
        setComments(c); setUser(u); setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [id])

  if (loading) return <div style={{ maxWidth:800, margin:'0 auto', padding:'2rem', position:'relative', zIndex:1 }}><Spinner/></div>
  if (error)   return <div style={{ maxWidth:800, margin:'0 auto', padding:'2rem', position:'relative', zIndex:1 }}><ErrorBox message={error}/></div>
  if (!post)   return null

  const accent = ACCENTS[post.userId % ACCENTS.length]
  const saved = isBookmarked(post.id)

  const handleBookmark = () => {
    if (!authUser) { showToast('Sign in to save posts!','error'); return }
    toggleBookmark(post)
    showToast(saved ? 'Removed from bookmarks' : '🔖 Saved!')
  }

  return (
    <div style={{ maxWidth:820, margin:'0 auto', padding:'2.5rem 1.5rem', position:'relative', zIndex:1 }}>
      <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
        <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600, color:'var(--muted)', marginBottom:'2rem', transition:'color .2s' }}
          onMouseEnter={e => e.currentTarget.style.color='#a78bfa'}
          onMouseLeave={e => e.currentTarget.style.color='var(--muted)'}>
          ← Back to posts
        </Link>
      </motion.div>

      {/* API trail */}
      {/* <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:'1.5rem' }}>
        {[`GET /posts/${id}`,`GET /posts/${id}/comments`,`GET /users/${post.userId}`].map(ep => (
          <code key={ep} style={{ fontSize:11, background:'rgba(139,92,246,.1)', color:'#a78bfa', padding:'3px 10px', borderRadius:20, border:'1px solid rgba(139,92,246,.2)' }}>{ep}</code>
        ))}
      </div> */}

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
        {/* Title */}
        <div style={{ borderLeft:`4px solid ${accent}`, paddingLeft:'1.5rem', marginBottom:'1.5rem' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.6rem,4vw,2.5rem)', fontWeight:900, lineHeight:1.2, textTransform:'capitalize', color:'#f1f5f9' }}>
            {post.title}
          </h1>
        </div>

        {/* Meta row */}
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:12, marginBottom:'2rem' }}>
          {user && (
            <Link to={`/users/${user.id}`} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,.05)', border:'1px solid var(--border)', borderRadius:40, padding:'6px 14px 6px 6px', transition:'border-color .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor=accent}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${accent},${accent}88)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff' }}>
                {user.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
              </div>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:'#f1f5f9' }}>{user.name}</p>
                <p style={{ fontSize:10, color:accent }}>@{user.username}</p>
              </div>
            </Link>
          )}
          {[['📖',`${Math.max(1,Math.ceil(post.body.split(' ').length/200))} min read`],['💬',`${comments.length} comments`],['🆔',`Post #${post.id}`]].map(([icon,label]) => (
            <span key={label} style={{ fontSize:12, color:'var(--muted)', background:'rgba(255,255,255,.06)', padding:'5px 12px', borderRadius:20 }}>{icon} {label}</span>
          ))}
          <motion.button whileTap={{ scale:.9 }} onClick={handleBookmark}
            style={{ marginLeft:'auto', background: saved?`${accent}22`:'rgba(255,255,255,.06)', border:`1px solid ${saved?accent:'var(--border)'}`, borderRadius:10, padding:'7px 14px', fontSize:13, color: saved?accent:'var(--muted)', fontWeight:600, transition:'all .2s' }}>
            {saved ? '🔖 Saved' : '🏷️ Save'}
          </motion.button>
        </div>

        {/* Body */}
        <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:16, padding:'2rem', marginBottom:'2.5rem', lineHeight:1.9, fontSize:15.5, color:'#cbd5e1' }}>
          {post.body.split('\n').map((para,i) => <p key={i} style={{ marginBottom:'1rem' }}>{para}</p>)}
        </div>

        {/* Comments */}
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:700, marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:12 }}>
          💬 Comments
          <span style={{ fontFamily:'var(--font-body)', fontSize:13, background:'rgba(139,92,246,.2)', color:'#a78bfa', padding:'2px 12px', borderRadius:20 }}>{comments.length}</span>
        </h2>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {comments.map((c, i) => {
            const hue = (c.id*47)%360
            return (
              <motion.div key={c.id} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
                style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderLeft:`3px solid hsl(${hue},60%,55%)`, borderRadius:12, padding:'1rem 1.25rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{ width:30, height:30, borderRadius:'50%', background:`hsl(${hue},60%,40%)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>
                    {c.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, textTransform:'capitalize' }}>{c.name.split(' ').slice(0,3).join(' ')}</p>
                    <p style={{ fontSize:11, color:`hsl(${hue},60%,60%)` }}>{c.email}</p>
                  </div>
                </div>
                <p style={{ fontSize:13.5, color:'var(--muted)', lineHeight:1.7 }}>{c.body}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
