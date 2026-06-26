import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { bookmarks, history } = useApp()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { to:'/', label:'Posts', icon:'📝' },
    { to:'/users', label:'Authors', icon:'👥' },
    ...(user ? [
      { to:'/bookmarks', label:`Saved (${bookmarks.length})`, icon:'🔖' },
      { to:'/history', label:`History (${history.length})`, icon:'🕘' },
    ] : []),
  ]

  return (
    <motion.header initial={{ y:-80 }} animate={{ y:0 }} transition={{ type:'spring', stiffness:300, damping:30 }}
      style={{
        position:'sticky', top:0, zIndex:500,
        background:'rgba(7,7,15,0.85)',
        backdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(139,92,246,0.2)',
      }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
        {/* Logo */}
        <Link to="/">
          <motion.div whileHover={{ scale:1.04 }} style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:'linear-gradient(135deg,#8b5cf6,#ec4899)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, boxShadow:'0 0 20px rgba(139,92,246,.5)'
            }}>✍️</div>
            <span style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:900 }}>
              Ink<span style={{ background:'linear-gradient(135deg,#8b5cf6,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Drop</span>
            </span>
          </motion.div>
        </Link>

        {/* Nav links */}
        <nav style={{ display:'flex', gap:'0.25rem', alignItems:'center' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to==='/'} style={({ isActive }) => ({
              padding:'7px 14px', borderRadius:10, fontSize:13, fontWeight:600,
              color: isActive ? '#fff' : 'var(--muted)',
              background: isActive ? 'rgba(139,92,246,.2)' : 'transparent',
              border: isActive ? '1px solid rgba(139,92,246,.4)' : '1px solid transparent',
              transition:'all .2s',
            })}>
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ position:'relative' }}>
          {user ? (
            <>
              <motion.button whileHover={{ scale:1.05 }} onClick={() => setOpen(o => !o)}
                style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,.06)', border:'1px solid var(--border)', borderRadius:40, padding:'6px 14px 6px 8px', cursor:'pointer' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff' }}>{user.avatar}</div>
                <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{user.name.split(' ')[0]}</span>
                <span style={{ fontSize:10, color:'var(--muted)' }}>▼</span>
              </motion.button>
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ opacity:0, y:8, scale:.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8, scale:.95 }}
                    style={{ position:'absolute', right:0, top:'calc(100% + 8px)', width:200, background:'rgba(12,12,24,0.95)', backdropFilter:'blur(20px)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden', zIndex:600 }}>
                    <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                      <p style={{ fontSize:13, fontWeight:700 }}>{user.name}</p>
                      <p style={{ fontSize:11, color:'var(--muted)' }}>{user.email}</p>
                      <span style={{ fontSize:10, background:'rgba(139,92,246,.2)', color:'#a78bfa', padding:'2px 8px', borderRadius:20, marginTop:4, display:'inline-block' }}>{user.role}</span>
                    </div>
                    {[
                      { label:'📝 My Posts', action:() => { navigate('/'); setOpen(false) } },
                      { label:'🔖 Bookmarks', action:() => { navigate('/bookmarks'); setOpen(false) } },
                      { label:'🕘 History', action:() => { navigate('/history'); setOpen(false) } },
                    ].map(item => (
                      <button key={item.label} onClick={item.action}
                        style={{ width:'100%', padding:'10px 16px', background:'transparent', border:'none', color:'var(--text)', fontSize:13, textAlign:'left', transition:'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(139,92,246,.1)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop:'1px solid var(--border)' }}>
                      <button onClick={() => { logout(); setOpen(false) }}
                        style={{ width:'100%', padding:'10px 16px', background:'transparent', border:'none', color:'#f87171', fontSize:13, fontWeight:600, textAlign:'left', transition:'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,.08)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        🚪 Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div whileHover={{ scale:1.04 }}>
              <Link to="/login" className="glow-btn" style={{ padding:'8px 20px', borderRadius:10, fontSize:13 }}>Sign In</Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  )
}
