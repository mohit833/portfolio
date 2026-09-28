import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { profile } from '../data'
import { ease } from './motion'

export function Preloader({ onDone }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.7,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setTimeout(onDone, 200),
    })
    return () => controls.stop()
  }, [onDone])

  return (
    <motion.div
      className="preloader"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="preloader-top mono">
        <span>{profile.name}</span>
        <span>Portfolio © {new Date().getFullYear()}</span>
      </div>
      <div className="preloader-count">
        {count}
        <span className="accent">%</span>
      </div>
      <div className="preloader-bar">
        <span style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </motion.div>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState({ hover: false, label: '', dark: false })
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    setEnabled(true)
    document.documentElement.classList.add('has-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const t = e.target.closest('a, button, [data-cursor]')
      const dark = !!e.target.closest('.xp-row, .award.is-featured, .btn-primary')
      setState({ hover: !!t, label: t?.dataset.cursor || '', dark })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [x, y])

  if (!enabled) return null
  const size = state.label ? 96 : state.hover ? 60 : 34
  return (
    <>
      <motion.div className="cursor-anchor" style={{ x, y }}>
        <div className={`cursor-dot${state.dark ? ' is-dark' : ''}`} />
      </motion.div>
      <motion.div className="cursor-anchor" style={{ x: sx, y: sy }}>
        <motion.div
          className={`cursor-ring${state.hover ? ' is-hover' : ''}${state.label ? ' has-label' : ''}${
            state.dark && !state.label ? ' is-dark' : ''
          }`}
          animate={{ width: size, height: size }}
          transition={{ duration: 0.35, ease }}
        >
          {state.label && <span>{state.label}</span>}
        </motion.div>
      </motion.div>
    </>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <motion.div
        className="footer-big"
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {'MOHIT M B'.split('').map((ch, i) => (
          <span className="char-mask" key={i}>
            <motion.span
              className="char"
              variants={{
                hidden: { y: '100%' },
                visible: { y: 0, transition: { duration: 1, delay: i * 0.04, ease } },
              }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          </span>
        ))}
      </motion.div>
      <div className="footer-row">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
