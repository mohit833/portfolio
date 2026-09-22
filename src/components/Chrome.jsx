import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion'
import { profile } from '../data'
import { ease } from './motion'

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
]

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

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(v > prev && v > 240 && !open)
    setScrolled(v > 24)
  })

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <motion.nav
        className={`nav${scrolled ? ' is-scrolled' : ''}`}
        animate={{ y: hidden ? '-120%' : 0 }}
        transition={{ duration: 0.45, ease }}
      >
        <a href="#top" className="nav-logo" aria-label="Back to top">
          MMB<span className="accent">.</span>
        </a>
        <ul className="nav-links">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <a className="btn btn-small" href={profile.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
          <button
            className={`nav-burger${open ? ' is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease }}
          >
            <ul>
              {NAV.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}
                >
                  <a href={n.href} onClick={() => setOpen(false)}>
                    <span className="mono">0{i + 1}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
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
