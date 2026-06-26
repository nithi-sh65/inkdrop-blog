import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api'
import PostCard from '../components/PostCard'
import { Spinner, ErrorBox } from '../components/Loader'

const ACCENTS = ['#8b5cf6','#ec4899','#06b6d4','#f59e0b','#10b981','#f97316']

export default function UserDetail() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.getUser(id), api.getUserPosts(id)])
      .then(([u,p]) => { setUser(u); setPosts(p); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [id])

  if (loading) return <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem', position:'relative', zIndex:1 }}><Spinner/></div>
  if (error)   return <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem', position:'relative', zIndex:1 }}><ErrorBox message={error}/></div>
  if (!user)   return null

  const accent = ACCENTS[user.id % ACCENTS.length]
  const initials = user.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'2.5rem 1.5rem', position:'relative', zIndex:1 }}>
      <Link to="/users" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'var(--muted)', marginBottom:'2rem', transition:'color .2s' }}
        onMouseEnter={e => e.currentTarget.style.color=accent} onMouseLeave={e => e.currentTarget.style.color='var(--muted)'}>
        ← Back to authors
      </Link>

      {/* Profile card */}
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
        style={{ background:'rgba(255,255,255,.04)', border:`1px solid ${accent}44`, borderRadius:20, padding:'2rem', marginBottom:'2.5rem', borderTop:`4px solid ${accent}`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:`${accent}15`, filter:'blur(40px)', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' }}>
          <motion.div animate={{ boxShadow:[`0 0 20px ${accent}40`,`0 0 50px ${accent}80`,`0 0 20px ${accent}40`] }} transition={{ repeat:Infinity, duration:3 }}
            style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${accent},${accent}77)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:900, color:'#fff', flexShrink:0, fontFamily:'var(--font-display)' }}>
            {initials}
          </motion.div>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:900, marginBottom:4 }}>{user.name}</h1>
            <p style={{ fontSize:14, color:accent, fontWeight:700, marginBottom:12 }}>@{user.username}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:8 }}>
              {[['✉️','Email',user.email],['📞','Phone',user.phone],['🌐','Website',user.website],['🏢','Company',user.company.name],['📍','City',user.address.city],['💡','Motto',user.company.catchPhrase]].map(([icon,label,val]) => (
                <div key={label} style={{ fontSize:12 }}>
                  <span style={{ color:'var(--muted)', fontWeight:600 }}>{icon} {label}: </span>
                  <span style={{ color:'#e2e8f0' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign:'center', background:`${accent}18`, border:`1px solid ${accent}44`, borderRadius:16, padding:'1.25rem 2rem', flexShrink:0 }}>
            <p style={{ fontSize:40, fontWeight:900, color:accent, fontFamily:'var(--font-display)' }}>{posts.length}</p>
            <p style={{ fontSize:12, color:'var(--muted)', fontWeight:600 }}>Posts</p>
          </div>
        </div>
      </motion.div>

      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:700, marginBottom:'1.5rem' }}>
        Posts by {user.name.split(' ')[0]}
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
        {posts.map((post,i) => <PostCard key={post.id} post={post} user={user} index={i}/>)}
      </div>
    </div>
  )
}
