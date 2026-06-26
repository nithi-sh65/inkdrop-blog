import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Toast() {
  const { toast } = useAuth()
  return (
    <AnimatePresence>
      {toast && (
        <motion.div key={toast.id}
          initial={{ opacity:0, y:40, scale:.9 }}
          animate={{ opacity:1, y:0, scale:1 }}
          exit={{ opacity:0, y:20, scale:.95 }}
          transition={{ type:'spring', stiffness:400, damping:28 }}
          style={{
            position:'fixed', bottom:28, right:28, zIndex:9999,
            padding:'14px 22px', borderRadius:14,
            background: toast.type==='error'
              ? 'linear-gradient(135deg,rgba(239,68,68,.9),rgba(220,38,38,.9))'
              : 'linear-gradient(135deg,rgba(139,92,246,.9),rgba(236,72,153,.8))',
            backdropFilter:'blur(16px)',
            color:'#fff', fontWeight:600, fontSize:14,
            boxShadow:'0 8px 32px rgba(0,0,0,.4)',
            border:'1px solid rgba(255,255,255,.15)',
            maxWidth:340,
          }}>
          {toast.type==='error' ? '❌ ' : '✅ '}{toast.msg}
          <div style={{
            position:'absolute', bottom:0, left:0,
            height:3, background:'rgba(255,255,255,.5)',
            borderRadius:'0 0 0 14px',
            animation:'progress-bar 3.5s linear forwards',
            width:'100%',
          }}/>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
