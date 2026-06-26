import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api'
import { Spinner, ErrorBox } from '../components/Loader'

const ACCENTS = ['#8b5cf6','#ec4899','#06b6d4','#f59e0b','#10b981','#f97316']

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.getUsers().then(d => { setUsers(d); setLoading(false) }).catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.company.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 1.5rem', position:'relative', zIndex:1 }}>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', marginBottom:'3rem' }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, marginBottom:'1rem' }}>
          Meet the <span className="gradient-text">Authors</span>
        </h1>
        <p style={{ color:'var(--muted)', fontSize:15, marginBottom:'1.5rem' }}>{users.length} writers loaded from API</p>
        <div style={{ maxWidth:400, margin:'0 auto', position:'relative' }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16 }}>🔍</span>
          <input placeholder="Search authors…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:42, borderRadius:40, height:46 }}/>
        </div>
      </motion.div>

      {loading && <Spinner/>}
      {error && <ErrorBox message={error}/>}
      {!loading && !error && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1.25rem' }}>
          {filtered.map((user, i) => {
            const accent = ACCENTS[user.id % ACCENTS.length]
            const initials = user.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
            return (
              <motion.div key={user.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:Math.min(i*0.07,.5) }}>
                <Link to={`/users/${user.id}`} style={{ display:'block' }}>
                  <div style={{ padding:'1.75rem', borderRadius:16, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', textAlign:'center', transition:'all .25s', cursor:'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=accent; e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow=`0 12px 40px ${accent}30` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,.07)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}>
                    <div style={{ width:70, height:70, borderRadius:'50%', background:`linear-gradient(135deg,${accent},${accent}66)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:900, color:'#fff', margin:'0 auto 1rem', boxShadow:`0 0 30px ${accent}50`, fontFamily:'var(--font-display)' }}>
                      {initials}
                    </div>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem', fontWeight:700, marginBottom:4 }}>{user.name}</h3>
                    <p style={{ fontSize:12, color:accent, fontWeight:700, marginBottom:10 }}>@{user.username}</p>
                    {[['✉️', user.email], ['🌐', user.website], ['🏢', user.company.name]].map(([icon, val]) => (
                      <p key={val} style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>{icon} {val}</p>
                    ))}
                    <div style={{ marginTop:'1rem', fontSize:12, color:accent, fontWeight:700 }}>View Posts →</div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
