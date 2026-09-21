import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '../data'
import { Magnetic, ease } from './motion'

const LINES = ['MOHIT', 'M B']

const fadeUp = (delay) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease } },
})

const charUp = {
  hidden: { y: '105%', rotate: 8 },
  visible: (delay) => ({ y: 0, rotate: 0, transition: { duration: 1.1, delay, ease } }),
}

function istTime() {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())
}

// Grid of dots that scatter away from the pointer and spring back.
export function DotField() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const GAP = 28
    const PUSH = 150
    const GLOW = 240
    const mouse = { x: -9999, y: -9999 }
    let dots = []
    let w = 0
    let h = 0
    let raf = 0
    let running = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 })
      }
      if (!running) draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      for (const d of dots) {
        const dx = d.x - mouse.x
        const dy = d.y - mouse.y
        const dist = Math.hypot(dx, dy) || 1
        if (!reduced) {
          if (dist < PUSH) {
            const f = (1 - dist / PUSH) * 2.4
            d.vx += (dx / dist) * f
            d.vy += (dy / dist) * f
          }
          d.vx = (d.vx + (d.ox - d.x) * 0.05) * 0.84
          d.vy = (d.vy + (d.oy - d.y) * 0.05) * 0.84
          d.x += d.vx
          d.y += d.vy
        }
        const near = Math.max(0, 1 - dist / GLOW)
        if (near > 0) {
          ctx.fillStyle = `rgba(200,255,61,${0.15 + near * 0.85})`
          ctx.beginPath()
          ctx.arc(d.x, d.y, 1 + near * 1.6, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = 'rgba(255,255,255,0.12)'
        } else {
          ctx.fillRect(d.x - 1, d.y - 1, 2, 2)
        }
      }
    }

    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || reduced) return
      running = true
      loop()
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(canvas)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className="hero-dots" aria-hidden="true" />
}

function Rotator({ words, active }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2400)
    return () => clearInterval(id)
  }, [active, words.length])

  return (
    <span className="rotator">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          className="rotator-word"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          {words[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero({ ready }) {
  const ref = useRef(null)
  const [time, setTime] = useState(istTime)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const show = ready ? 'visible' : 'hidden'

  useEffect(() => {
    const id = setInterval(() => setTime(istTime()), 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero" id="top" ref={ref}>
      <DotField />
      <div className="hero-glow" aria-hidden="true" />

      <motion.div className="hero-top" initial="hidden" animate={show} variants={fadeUp(0.7)}>
        <span className="status">
          <span className="status-dot" />
          {profile.role} @ {profile.company}
        </span>
        <span className="mono muted">
          {profile.location} · {time} IST
        </span>
      </motion.div>

      <motion.h1
        className="hero-name"
        style={{ y: nameY, opacity: fade }}
        aria-label={profile.name}
        initial="hidden"
        animate={show}
      >
        {LINES.map((line, li) => (
          <span className="hero-line" key={line} aria-hidden="true">
            {line.split('').map((ch, ci) => (
              <span className="char-mask" key={ci}>
                <motion.span className="char" variants={charUp} custom={0.05 + li * 0.18 + ci * 0.05}>
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              </span>
            ))}
            {li === LINES.length - 1 && (
              <motion.span
                className="hero-dot"
                variants={{
                  hidden: { scale: 0 },
                  visible: { scale: 1, transition: { type: 'spring', stiffness: 260, damping: 14, delay: 0.9 } },
                }}
              />
            )}
          </span>
        ))}
      </motion.h1>

      <motion.div style={{ opacity: fade }}>
        <motion.div className="hero-bottom" initial="hidden" animate={show} variants={fadeUp(0.9)}>
          <p className="hero-tagline">
            Software Engineer at Esko.
            <br />
            I build <Rotator words={profile.building} active={ready} />
          </p>
          <div className="hero-ctas">
            <Magnetic>
              <a className="btn btn-primary" href="#work" data-cursor="View">
                See my work <span aria-hidden="true">↓</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href="#contact">
                Get in touch
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      <div className="scroll-cue" aria-hidden="true">
        <span className="mono">Scroll</span>
        <span className="scroll-cue-line" />
      </div>
    </section>
  )
}
