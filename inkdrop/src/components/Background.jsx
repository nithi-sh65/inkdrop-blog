import { useEffect, useRef } from 'react'

export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animFrame
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.3
        this.speedX = (Math.random() - 0.5) * 0.4
        this.speedY = (Math.random() - 0.5) * 0.4
        this.opacity = Math.random() * 0.6 + 0.1
        this.color = ['#8b5cf6','#ec4899','#06b6d4','#f59e0b'][Math.floor(Math.random()*4)]
      }
      update() {
        this.x += this.speedX; this.y += this.speedY
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle())

    let t = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.003

      // Draw orbs
      const orbs = [
        { x: canvas.width*0.2 + Math.sin(t)*80, y: canvas.height*0.3 + Math.cos(t*0.7)*60, r:280, c:'rgba(139,92,246,' },
        { x: canvas.width*0.8 + Math.cos(t*0.8)*70, y: canvas.height*0.7 + Math.sin(t)*50, r:240, c:'rgba(236,72,153,' },
        { x: canvas.width*0.5 + Math.sin(t*1.2)*60, y: canvas.height*0.5 + Math.cos(t)*70, r:200, c:'rgba(6,182,212,' },
      ]
      orbs.forEach(o => {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, o.c+'0.12)')
        g.addColorStop(1, o.c+'0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Lines between close particles
      particles.forEach((p, i) => {
        particles.slice(i+1).forEach(q => {
          const dx = p.x - q.x, dy = p.y - q.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(139,92,246,${0.08*(1-dist/100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
        p.update(); p.draw()
      })

      animFrame = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />
      {/* Grid overlay */}
      <div style={{
        position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
        backgroundSize:'60px 60px'
      }} />
    </>
  )
}
