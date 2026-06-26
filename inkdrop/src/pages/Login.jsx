import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ username:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const ok = login(form.username, form.password)
    setLoading(false)
    if (ok) navigate('/')
  }

  const demoAccounts = [
    { username:'Minnie mouse', password:'Minnie123', label:'Admin', color:'#8b5cf6' },
    { username:'demo', password:'demo123', label:'Reader', color:'#06b6d4' },
  ]

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', position:'relative', zIndex:1 }}>
      <motion.div initial={{ opacity:0, y:40, scale:.95 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:.5, type:'spring' }}
        style={{ width:'100%', maxWidth:440 }}>

        {/* Card */}
        <div style={{ background:'rgba(12,12,24,0.9)', backdropFilter:'blur(30px)', border:'1px solid rgba(139,92,246,.3)', borderRadius:24, padding:'2.5rem', boxShadow:'0 25px 80px rgba(0,0,0,.6)' }}>

          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <motion.div animate={{ rotate:[0,5,-5,0] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut' }}
              style={{ width:64, height:64, borderRadius:18, background:'linear-gradient(135deg,#8b5cf6,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, margin:'0 auto 1rem', boxShadow:'0 0 40px rgba(139,92,246,.5)' }}>
              ✍️
            </motion.div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:900, marginBottom:6 }}>
              Welcome to <span className="gradient-text">InkDrop</span>
            </h1>
            <p style={{ fontSize:13, color:'var(--muted)' }}>Sign in to read, save, and explore blogs</p>
          </div>

          {/* Demo accounts */}
          <div style={{ marginBottom:'1.5rem' }}>
            <p style={{ fontSize:11, color:'var(--muted)', fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10 }}>Quick Login</p>
            <div style={{ display:'flex', gap:10 }}>
              {demoAccounts.map(acc => (
                <motion.button key={acc.username} whileHover={{ scale:1.04 }} whileTap={{ scale:.96 }}
                  onClick={() => setForm({ username:acc.username, password:acc.password })}
                  style={{ flex:1, padding:'10px', borderRadius:12, background:'rgba(255,255,255,.04)', border:`1px solid ${acc.color}55`, color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', transition:'border-color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor=acc.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor=`${acc.color}55`}>
                  <span style={{ color:acc.color }}>●</span> {acc.label}<br/>
                  <span style={{ color:'var(--muted)', fontSize:10 }}>@{acc.username}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.5rem' }}>
            <div style={{ flex:1, height:1, background:'var(--border)' }}/>
            <span style={{ fontSize:12, color:'var(--muted)' }}>or enter manually</span>
            <div style={{ flex:1, height:1, background:'var(--border)' }}/>
          </div>

          {/* Form */}
          <form onSubmit={handle}>
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ fontSize:12, fontWeight:700, color:'var(--muted)', display:'block', marginBottom:6, letterSpacing:'.05em' }}>USERNAME</label>
              <input placeholder="Enter username" value={form.username} onChange={e => setForm(f => ({ ...f, username:e.target.value }))} required/>
            </div>
            <div style={{ marginBottom:'1.5rem', position:'relative' }}>
              <label style={{ fontSize:12, fontWeight:700, color:'var(--muted)', display:'block', marginBottom:6, letterSpacing:'.05em' }}>PASSWORD</label>
              <input type={showPass?'text':'password'} placeholder="Enter password" value={form.password} onChange={e => setForm(f => ({ ...f, password:e.target.value }))} required style={{ paddingRight:44 }}/>
              <button type="button" onClick={() => setShowPass(s=>!s)}
                style={{ position:'absolute', right:12, bottom:12, background:'none', border:'none', color:'var(--muted)', fontSize:16, cursor:'pointer' }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            <motion.button type="submit" className="glow-btn" disabled={loading}
              whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
              style={{ width:'100%', padding:'14px', fontSize:15, borderRadius:12, opacity:loading?.7:1 }}>
              {loading ? (
                <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                  <div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
                  Signing in…
                </span>
              ) : '🚀 Sign In'}
            </motion.button>
          </form>

          <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:13, color:'var(--muted)' }}>
            <Link to="/" style={{ color:'#a78bfa', fontWeight:600 }}>← Browse without signing in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
