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

const SECTION_IDS = ['about', 'skills', 'experience', 'work', 'contact']

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

// Highlights the section you are currently reading.
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting)
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

export function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  // The nav stays put: it only compacts once you leave the top of the page.
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <nav className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <a href="#top" className="nav-logo" aria-label="Back to top">
          MMB<span className="accent">.</span>
        </a>
        <ul className="nav-links">
          {NAV.map((n) => {
            const current = n.href.slice(1) === active
            return (
              <li key={n.href}>
                <a href={n.href} className={current ? 'is-active' : ''} aria-current={current ? 'true' : undefined}>
                  {current && (
                    <motion.span
                      className="nav-pill"
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span>{n.label}</span>
                </a>
              </li>
            )
          })}
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
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease }}
          >
            <ul className="mobile-links">
              {NAV.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease }}
                >
                  <a
                    href={n.href}
                    className={n.href.slice(1) === active ? 'is-active' : ''}
                    onClick={() => setOpen(false)}
                  >
                    <span className="mono">0{i + 1}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mobile-foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.5, ease }}
            >
              <a className="mobile-mail" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <div className="mobile-socials">
                {profile.links.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
                <a href={profile.resume} target="_blank" rel="noreferrer">
                  Resume <span aria-hidden="true">↗</span>
                </a>
              </div>
            </motion.div>
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
