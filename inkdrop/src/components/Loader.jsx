export function Spinner() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'5rem 0', gap:16 }}>
      <div className="spinner"/>
      <p style={{ color:'var(--muted)', fontSize:14 }}>Fetching from API…</p>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div style={{ padding:'1.5rem', borderRadius:16, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderTop:'3px solid rgba(139,92,246,.3)' }}>
      <div style={{ display:'flex', gap:10, marginBottom:12 }}>
        <div className="skeleton" style={{ width:30, height:30, borderRadius:'50%', flexShrink:0 }}/>
        <div style={{ flex:1 }}><div className="skeleton" style={{ width:'60%', height:10, marginBottom:6 }}/><div className="skeleton" style={{ width:'40%', height:8 }}/></div>
      </div>
      <div className="skeleton" style={{ width:'90%', height:16, marginBottom:8 }}/>
      <div className="skeleton" style={{ width:'70%', height:16, marginBottom:16 }}/>
      <div className="skeleton" style={{ width:'100%', height:11, marginBottom:5 }}/>
      <div className="skeleton" style={{ width:'100%', height:11, marginBottom:5 }}/>
      <div className="skeleton" style={{ width:'65%', height:11 }}/>
    </div>
  )
}

export function ErrorBox({ message }) {
  return (
    <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.3)', borderRadius:16, padding:'2rem', textAlign:'center', color:'#f87171' }}>
      <p style={{ fontSize:32, marginBottom:8 }}>⚠️</p>
      <p style={{ fontWeight:700, marginBottom:4 }}>Something went wrong</p>
      <p style={{ fontSize:13, color:'var(--muted)' }}>{message}</p>
    </div>
  )
}
