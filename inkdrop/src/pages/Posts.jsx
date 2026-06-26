import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { api } from '../api'
import PostCard from '../components/PostCard'
import { SkeletonCard, ErrorBox } from '../components/Loader'

const PER_PAGE = 12

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('default')

  useEffect(() => {
    Promise.all([api.getPosts(), api.getUsers()])
      .then(([p, u]) => {
        setPosts(p)
        const m = {}; u.forEach(x => m[x.id]=x); setUsers(m)
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    let list = posts.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.toLowerCase().includes(search.toLowerCase())
    )
    if (sort === 'title') list = [...list].sort((a,b) => a.title.localeCompare(b.title))
    if (sort === 'user') list = [...list].sort((a,b) => a.userId - b.userId)
    return list
  }, [posts, search, sort])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 1.5rem', position:'relative', zIndex:1 }}>
      {/* Hero */}
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }} style={{ textAlign:'center', marginBottom:'3rem' }}>
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:.2, type:'spring' }}
          style={{ display:'inline-block', background:'rgba(139,92,246,.15)', border:'1px solid rgba(139,92,246,.3)', borderRadius:30, padding:'6px 18px', fontSize:12, fontWeight:700, color:'#a78bfa', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:16 }}>
          📡 Live from JSONPlaceholder API
        </motion.div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem,6vw,4rem)', fontWeight:900, lineHeight:1.1, marginBottom:'1rem' }}>
          <span className="gradient-text">Stories</span> Worth Reading
        </h1>
        <p style={{ fontSize:16, color:'var(--muted)', maxWidth:500, margin:'0 auto 2rem' }}>
          {posts.length} posts from {Object.keys(users).length} authors — fetched live from the API.
        </p>

        {/* Search & Sort */}
        <div style={{ display:'flex', gap:12, maxWidth:600, margin:'0 auto', flexWrap:'wrap', justifyContent:'center' }}>
          <div style={{ flex:1, minWidth:260, position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16, pointerEvents:'none' }}>🔍</span>
            <input placeholder="Search posts…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{ paddingLeft:42, borderRadius:40, height:46 }}/>
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding:'0 16px', borderRadius:40, height:46, minWidth:150, appearance:'none', cursor:'pointer' }}>
            <option value="default">Default order</option>
            <option value="title">Sort by title</option>
            <option value="user">Sort by author</option>
          </select>
        </div>
      </motion.div>

      {/* API status */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.4 }}
        style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.5rem', fontSize:12 }}>
        <span style={{ width:8, height:8, borderRadius:'50%', background: loading?'#f59e0b':error?'#ef4444':'#10b981', display:'inline-block', boxShadow:`0 0 8px ${loading?'#f59e0b':error?'#ef4444':'#10b981'}` }}/>
        <code style={{ background:'rgba(255,255,255,.06)', padding:'3px 10px', borderRadius:6, fontSize:11, color:'var(--muted)' }}></code>
        {!loading && !error && <span style={{ color:'#10b981', fontWeight:700 }}> </span>}
      </motion.div>

      {error && <ErrorBox message={error}/>}

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
          {Array(6).fill(0).map((_,i) => <SkeletonCard key={i}/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'5rem', color:'var(--muted)' }}>
          <p style={{ fontSize:48 }}>📭</p>
          <p style={{ marginTop:12, fontSize:16 }}>No posts match "<strong style={{ color:'#a78bfa' }}>{search}</strong>"</p>
        </div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
            {paginated.map((post, i) => <PostCard key={post.id} post={post} user={users[post.userId]} index={i}/>)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}
              style={{ display:'flex', justifyContent:'center', gap:8, marginTop:'3rem', flexWrap:'wrap' }}>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                style={{ padding:'8px 18px', borderRadius:10, background:'rgba(255,255,255,.06)', border:'1px solid var(--border)', color: page===1?'var(--muted)':'var(--text)', fontSize:13, fontWeight:600, transition:'all .2s' }}>
                ← Prev
              </button>
              {Array.from({ length:totalPages }, (_,i) => i+1).map(n => (
                <motion.button key={n} whileHover={{ scale:1.1 }} whileTap={{ scale:.95 }} onClick={() => setPage(n)}
                  style={{ width:38, height:38, borderRadius:10, border:'1px solid', borderColor: n===page?'var(--purple)':'var(--border)', background: n===page?'var(--purple)':'rgba(255,255,255,.06)', color: n===page?'#fff':'var(--muted)', fontWeight:700, fontSize:13, boxShadow: n===page?'0 0 20px rgba(139,92,246,.5)':'' }}>
                  {n}
                </motion.button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                style={{ padding:'8px 18px', borderRadius:10, background:'rgba(255,255,255,.06)', border:'1px solid var(--border)', color: page===totalPages?'var(--muted)':'var(--text)', fontSize:13, fontWeight:600 }}>
                Next →
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
