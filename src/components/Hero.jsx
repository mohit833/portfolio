import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '../data'
import { Magnetic, ease, spotlight } from './motion'

const LINES = ['MOHIT', 'M B']

function istTime() {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())
}

export default function Hero() {
  const ref = useRef(null)
  const [time, setTime] = useState(istTime)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    const id = setInterval(() => setTime(istTime()), 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero" id="top" ref={ref} onPointerMove={spotlight}>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      <motion.div
        className="hero-top"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.9, ease }}
      >
        <span className="status">
          <span className="status-dot" />
          {profile.role} @ {profile.company}
        </span>
        <span className="mono muted">
          {profile.location} · {time} IST
        </span>
      </motion.div>

      <motion.h1 className="hero-name" style={{ y: nameY, opacity: fade }} aria-label={profile.name}>
        {LINES.map((line, li) => (
          <span className="hero-line" key={line} aria-hidden="true">
            {line.split('').map((ch, ci) => (
              <span className="char-mask" key={ci}>
                <motion.span
                  className="char"
                  initial={{ y: '105%', rotate: 8 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1.1, delay: 0.15 + li * 0.18 + ci * 0.05, ease }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              </span>
            ))}
            {li === LINES.length - 1 && (
              <motion.span
                className="hero-dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 1.1 }}
              />
            )}
          </span>
        ))}
      </motion.h1>

      <motion.div style={{ opacity: fade }}>
        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease }}
        >
          <p className="hero-tagline">{profile.tagline}</p>
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
