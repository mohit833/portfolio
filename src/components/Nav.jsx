import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { profile } from '../data'
import { ease } from './motion'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]
const IDS = NAV.map((n) => n.id)
const SPRING = { type: 'spring', stiffness: 420, damping: 38, mass: 0.7 }
const META_KEY = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform) ? '⌘' : 'Ctrl'

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="nav-key-icon" aria-hidden="true">
      <circle cx="7" cy="7" r="4.6" />
      <path d="M10.6 10.6 14 14" />
    </svg>
  )
}

// The last section whose top has crossed the reading line. Measuring beats an
// IntersectionObserver here: jumps land on the right section every time, and
// the sections between nav entries keep the previous one lit.
function useActiveSection() {
  const [active, setActive] = useState(IDS[0])
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.4
      let current = IDS[0]
      for (const id of IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return active
}

function ProgressRing({ progress }) {
  return (
    <svg className="nav-ring" viewBox="0 0 32 32" aria-hidden="true">
      <circle className="nav-ring-track" cx="16" cy="16" r="13" />
      <motion.circle
        className="nav-ring-bar"
        cx="16"
        cy="16"
        r="13"
        style={{ pathLength: progress }}
      />
    </svg>
  )
}

function Palette({ onClose, go }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)

  const items = useMemo(
    () => [
      ...NAV.map((n) => ({ key: n.id, label: n.label, hint: 'Section', run: () => go(n.id) })),
      {
        key: 'email',
        label: `Copy email — ${profile.email}`,
        hint: 'Action',
        keep: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email)
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
          } catch {
            window.location.href = `mailto:${profile.email}`
          }
        },
      },
      { key: 'resume', label: 'Open resume (PDF)', hint: 'Link', run: () => window.open(profile.resume, '_blank') },
      ...profile.links.map((l) => ({
        key: l.label,
        label: l.label,
        hint: 'Link',
        run: () => window.open(l.href, '_blank', 'noopener'),
      })),
    ],
    [go],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items
  }, [items, query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  useEffect(() => {
    setIndex(0)
  }, [query])

  const pick = (item) => {
    if (!item) return
    item.run()
    if (!item.keep) onClose()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (i + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      pick(results[index])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <motion.div
      className="palette-scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="palette"
        role="dialog"
        aria-label="Quick navigation"
        initial={{ opacity: 0, y: -14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.25, ease }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-field">
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a section, copy my email…"
            aria-label="Search sections and actions"
          />
          <kbd>esc</kbd>
        </div>
        <ul className="palette-list">
          {results.map((item, i) => (
            <li key={item.key}>
              <button
                className={i === index ? 'is-selected' : ''}
                onMouseEnter={() => setIndex(i)}
                onClick={() => pick(item)}
              >
                <span>{copied && item.key === 'email' ? 'Copied ✓' : item.label}</span>
                <span className="palette-hint">{item.hint}</span>
              </button>
            </li>
          ))}
          {!results.length && <li className="palette-empty">Nothing matches that.</li>}
        </ul>
      </motion.div>
    </motion.div>
  )
}

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [pressed, setPressed] = useState(null)
  const active = useActiveSection()
  const activeLabel = NAV.find((n) => n.id === active)?.label ?? 'About'

  // :active is unreliable on touch, so the press state is driven here: the
  // button reacts on pointerdown, before the tap is even released.
  const pressProps = (key) => ({
    onPointerDown: () => setPressed(key),
    onPointerUp: () => setPressed(null),
    onPointerCancel: () => setPressed(null),
    onPointerLeave: () => setPressed(null),
  })

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 120))

  // Collapsed: only the section you are in, until you reach for the bar.
  const collapsed = scrolled && !hovered && !paletteOpen

  // Drive the smooth-scroll engine directly; a native scroll would fight it.
  const go = useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.1 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      } else if (e.key === '/' && !typing && !paletteOpen) {
        e.preventDefault()
        setPaletteOpen(true)
      } else if (e.key === 'Escape') {
        setPaletteOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paletteOpen])

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <a href="#top" className="nav-logo" aria-label="Back to top">
          MMB<span className="accent">.</span>
        </a>

        {/* One rail: links never unmount, they just collapse to the current section. */}
        <nav
          className={`nav-rail${collapsed ? ' is-collapsed' : ''}`}
          aria-label="Sections"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
        >
          <span className="nav-ring-wrap" aria-hidden="true">
            <ProgressRing progress={scrollYProgress} />
          </span>
          <ul className="nav-links">
            {NAV.map((n) => {
              const current = n.id === active
              const tucked = collapsed && !current
              return (
                <li key={n.id} className={tucked ? 'is-tucked' : ''}>
                  <a
                    href={`#${n.id}`}
                    className={`nav-link${current ? ' is-active' : ''}`}
                    aria-current={current ? 'true' : undefined}
                    tabIndex={tucked ? -1 : 0}
                  >
                    {current && !collapsed && (
                      <motion.span className="nav-pill" layoutId="nav-pill" transition={SPRING} />
                    )}
                    <span>{n.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
          <span className="nav-chevron" aria-hidden="true">
            ⌄
          </span>
        </nav>

        <div className="nav-actions">
          <button className="nav-key" onClick={() => setPaletteOpen(true)} aria-label="Open quick navigation">
            <SearchIcon />
            <kbd>{META_KEY} K</kbd>
          </button>
          <a className="btn btn-small" href={profile.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </header>

      {/* Phones: navigation sits in thumb reach. */}
      <div className="nav-bottom">
        <button
          className={`nav-bottom-main${pressed === 'main' ? ' is-pressed' : ''}`}
          onClick={() => setMenuOpen(true)}
          aria-label="Open sections menu"
          {...pressProps('main')}
        >
          <ProgressRing progress={scrollYProgress} />
          <span className="nav-bottom-label">
            <em>Section</em>
            {activeLabel}
          </span>
          <span className="nav-bottom-caret" aria-hidden="true">
            ⌃
          </span>
        </button>
        <a
          className={`nav-bottom-cta${pressed === 'cta' ? ' is-pressed' : ''}`}
          href="#contact"
          {...pressProps('cta')}
        >
          Contact
        </a>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              ✕
            </button>
            <ul className="mobile-links">
              {NAV.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + i * 0.03, duration: 0.28, ease }}
                >
                  <a href={`#${n.id}`} className={n.id === active ? 'is-active' : ''} onClick={() => setMenuOpen(false)}>
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
              transition={{ delay: 0.18, duration: 0.28, ease }}
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

      <AnimatePresence>
        {paletteOpen && <Palette onClose={() => setPaletteOpen(false)} go={go} />}
      </AnimatePresence>
    </>
  )
}
