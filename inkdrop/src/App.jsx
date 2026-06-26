import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Background from './components/Background'
import Toast from './components/Toast'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import Login from './pages/Login'
import History from './pages/History'
import Bookmarks from './pages/Bookmarks'
import { useAuth } from './context/AuthContext'
import { Navigate } from 'react-router-dom'

function Protected({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login"/>
}

const pageVariants = {
  initial: { opacity:0, y:20 },
  animate: { opacity:1, y:0, transition:{ duration:.4, ease:[.4,0,.2,1] } },
  exit:    { opacity:0, y:-10, transition:{ duration:.25 } },
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <Background/>
      <div style={{ position:'relative', zIndex:1, minHeight:'100vh' }}>
        <Navbar/>
        <main>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Routes location={location}>
                <Route path="/"          element={<Posts/>}/>
                <Route path="/posts/:id" element={<PostDetail/>}/>
                <Route path="/users"     element={<Users/>}/>
                <Route path="/users/:id" element={<UserDetail/>}/>
                <Route path="/login"     element={<Login/>}/>
                <Route path="/history"   element={<Protected><History/></Protected>}/>
                <Route path="/bookmarks" element={<Protected><Bookmarks/></Protected>}/>
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        <footer style={{ textAlign:'center', padding:'2rem', fontSize:12, color:'var(--muted)', borderTop:'1px solid rgba(255,255,255,.06)', marginTop:'3rem', background:'rgba(7,7,15,.8)', backdropFilter:'blur(10px)' }}>
          <p>✍️ <strong style={{ color:'#a78bfa' }}> © 2026 InkDrop. All Rights Reserved.</strong>
          </p>
        </footer>
      </div>
      <Toast/>
    </>
  )
}
