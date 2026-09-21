import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useDragControls,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { profile, stats } from '../data'
import { DotField } from '../components/Hero'
import { ease } from '../components/motion'
import { APPS, APP_VIEWS, AppIcon, appById } from './apps'
import Agent from './Agent'
import Terminal from './Terminal'
import './os.css'

const DOCK = ['about', 'experience', 'projects', 'awards', 'agent', 'terminal', 'contact', 'resume']
const DOCK_PHONE = ['about', 'projects', 'agent', 'contact', 'resume']
const ICONS_WIDTH = 214 // two columns of desktop icons
const DOCK_SPACE = 96

const BOOT_LINES = [
  'Loading kernel: react@18',
  'Mounting /home/mohit',
  'Starting MCP servers: experience, projects, awards, security',
  'Veracode scan: 0 high-severity findings',
  'Syncing sprint board',
  'Portfolio agent online',
]

function readFlag(key) {
  try {
    return sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key) {
  try {
    sessionStorage.setItem(key, '1')
  } catch {}
}

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

function useClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(id)
  }, [])
  return time
}

// Where a new window appears: agent on the right, others cascading near the centre.
function place(app, count, rect) {
  const W = rect.width
  const H = rect.height - DOCK_SPACE
  const w = Math.min(app.w, W - 32)
  const h = Math.min(app.h, H - 24)
  let x
  let y
  if (app.id === 'agent') {
    x = W - w - 28
    y = 20
  } else {
    const k = count % 6
    x = Math.round((W - w) / 2 - 100 + k * 34)
    y = Math.round((H - h) / 2 + k * 26 - 30)
  }
  // Keep new windows clear of the desktop icons when there is room.
  const left = W - w - 12 > ICONS_WIDTH ? ICONS_WIDTH : 12
  x = Math.max(left, Math.min(x, W - w - 12))
  y = Math.max(12, Math.min(y, H - h))
  return { x, y, w, h }
}

function Boot({ onDone }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (n < BOOT_LINES.length) {
      const t = setTimeout(() => setN(n + 1), n === 0 ? 350 : 190)
      return () => clearTimeout(t)
    }
    const t = setTimeout(onDone, 650)
    return () => clearTimeout(t)
  }, [n, onDone])

  useEffect(() => {
    window.addEventListener('keydown', onDone)
    return () => window.removeEventListener('keydown', onDone)
  }, [onDone])

  return (
    <motion.div
      className="os-boot"
      onClick={onDone}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="os-boot-inner">
        <div className="os-boot-logo">
          <span className="os-logo-mark" />
          MohitOS
        </div>
        <div className="os-boot-lines">
          {BOOT_LINES.slice(0, n).map((l) => (
            <div key={l}>
              <span className="accent">[ OK ]</span> {l}
            </div>
          ))}
          {n === BOOT_LINES.length && <div className="os-boot-welcome">Welcome, visitor.</div>}
        </div>
        <div className="os-boot-bar">
          <span style={{ transform: `scaleX(${n / BOOT_LINES.length})` }} />
        </div>
      </div>
      <span className="os-boot-skip">Click or press any key to skip</span>
    </motion.div>
  )
}

function Window({ id, st, active, mobile, bounds, ops, children }) {
  const app = appById[id]
  const controls = useDragControls()
  const dx = useMotionValue(0)
  const dy = useMotionValue(0)
  const max = st.max || mobile

  // After a drag, the offset is committed to left/top; clear it in the same frame.
  useLayoutEffect(() => {
    dx.set(0)
    dy.set(0)
  }, [st.x, st.y, dx, dy])

  return (
    <motion.section
      role="dialog"
      aria-label={app.title}
      className={`os-window${active ? ' is-active' : ''}${max ? ' is-max' : ''}${st.min ? ' is-min' : ''}`}
      style={{
        zIndex: st.z,
        x: dx,
        y: dy,
        ...(max ? {} : { left: st.x, top: st.y, width: st.w, height: st.h }),
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={st.min ? { opacity: 0, scale: 0.7 } : { opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
      transition={{ duration: 0.32, ease }}
      drag={!max}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={bounds}
      onDragEnd={() => ops.move(id, dx.get(), dy.get())}
      onPointerDown={() => ops.focus(id)}
    >
      <header
        className="os-titlebar"
        onPointerDown={(e) => !max && e.button === 0 && controls.start(e)}
        onDoubleClick={() => !mobile && ops.toggleMax(id)}
      >
        <div className="os-lights" onPointerDown={(e) => e.stopPropagation()}>
          <button className="os-light is-close" aria-label={`Close ${app.title}`} onClick={() => ops.close(id)} />
          <button className="os-light is-min" aria-label={`Minimise ${app.title}`} onClick={() => ops.minimize(id)} />
          <button className="os-light is-max" aria-label={`Maximise ${app.title}`} onClick={() => ops.toggleMax(id)} />
        </div>
        <span className="os-title">
          <AppIcon id={id} size="xs" />
          {app.title}
        </span>
        <button
          className="os-close-mobile"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => ops.close(id)}
        >
          Close
        </button>
      </header>
      <div className="os-window-body">{children}</div>
    </motion.section>
  )
}

function DockItem({ id, mouseX, running, onOpen }) {
  const ref = useRef(null)
  const distance = useTransform(mouseX, (v) => {
    const b = ref.current?.getBoundingClientRect()
    return b ? v - b.x - b.width / 2 : Infinity
  })
  const size = useSpring(useTransform(distance, [-150, 0, 150], [50, 76, 50]), {
    mass: 0.1,
    stiffness: 180,
    damping: 13,
  })
  return (
    <motion.button
      ref={ref}
      className="os-dock-item"
      style={{ width: size, height: size }}
      onClick={() => onOpen(id)}
      aria-label={`Open ${appById[id].title}`}
    >
      <AppIcon id={id} size="fill" />
      <span className="os-dock-tip">{appById[id].title}</span>
      {running && <span className="os-dock-dot" />}
    </motion.button>
  )
}

function Dock({ apps, running, onOpen }) {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.nav
      className="os-dock"
      aria-label="Dock"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      initial={{ y: 120 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease, delay: 0.2 }}
    >
      {apps.map((id, i) => (
        <span key={id} className="os-dock-slot">
          {i === apps.length - 1 && <span className="os-dock-sep" />}
          <DockItem id={id} mouseX={mouseX} running={running.includes(id)} onOpen={onOpen} />
        </span>
      ))}
    </motion.nav>
  )
}

function Widgets({ openApp }) {
  return (
    <motion.aside
      className="os-widgets"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease, delay: 0.3 }}
    >
      <div className="os-widget os-widget-now">
        <span className="os-widget-label">
          <span className="status-dot" /> Now
        </span>
        <strong>
          {profile.role} @ {profile.company}
        </strong>
        <p>Building agentic AI tools with MCP, and keeping releases secure and on time.</p>
      </div>
      <div className="os-widget os-widget-stats">
        {[stats[0], stats[3], stats[2]].map((s) => (
          <div key={s.label}>
            <strong>
              {s.prefix}
              {s.value}
              {s.suffix}
            </strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <button className="os-widget os-widget-hint" onClick={() => openApp('agent')}>
        <span className="os-widget-label">New here?</span>
        <p>
          Ask Orbit, my AI agent, anything. It opens the right windows for you. <kbd>⌘</kbd> <kbd>K</kbd>
        </p>
      </button>
    </motion.aside>
  )
}

export default function OS() {
  const [booting, setBooting] = useState(() => !readFlag('boot-seen'))
  const [wins, setWins] = useState({})
  const [focusSignal, setFocusSignal] = useState({ agent: 0, terminal: 0 })
  const zTop = useRef(10)
  const desk = useRef(null)
  const mobile = useMedia('(max-width: 760px)')
  const time = useClock()

  const openApp = useCallback((id) => {
    setWins((prev) => {
      const z = ++zTop.current
      if (prev[id]) return { ...prev, [id]: { ...prev[id], min: false, z } }
      const rect = desk.current?.getBoundingClientRect() ?? { width: window.innerWidth, height: window.innerHeight }
      return { ...prev, [id]: { ...place(appById[id], Object.keys(prev).length, rect), z, min: false, max: false } }
    })
    if (id === 'agent' || id === 'terminal') setFocusSignal((s) => ({ ...s, [id]: s[id] + 1 }))
  }, [])

  const ops = {
    close: (id) =>
      setWins((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      }),
    minimize: (id) => setWins((prev) => ({ ...prev, [id]: { ...prev[id], min: true } })),
    toggleMax: (id) => setWins((prev) => ({ ...prev, [id]: { ...prev[id], max: !prev[id].max } })),
    focus: (id) =>
      setWins((prev) =>
        prev[id] && prev[id].z === zTop.current ? prev : { ...prev, [id]: { ...prev[id], z: ++zTop.current } },
      ),
    move: (id, dx, dy) =>
      setWins((prev) => ({ ...prev, [id]: { ...prev[id], x: prev[id].x + dx, y: prev[id].y + dy } })),
  }

  const visible = Object.entries(wins).filter(([, st]) => !st.min)
  const activeId = visible.sort((a, b) => b[1].z - a[1].z)[0]?.[0]

  const finishBoot = useCallback(() => {
    writeFlag('boot-seen')
    setBooting(false)
  }, [])

  // First impression: open About and the agent side by side on large screens.
  useEffect(() => {
    if (booting || mobile) return
    const t1 = setTimeout(() => openApp('about'), 500)
    const t2 = setTimeout(() => openApp('agent'), 850)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [booting, mobile, openApp])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openApp('agent')
      } else if (e.key === 'Escape' && activeId) {
        ops.close(activeId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const renderApp = (id) => {
    if (id === 'agent') return <Agent openApp={openApp} mobile={mobile} focusSignal={focusSignal.agent} />
    if (id === 'terminal') return <Terminal openApp={openApp} focusSignal={focusSignal.terminal} />
    const View = APP_VIEWS[id]
    return <View openApp={openApp} />
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="os">
        <header className="os-menubar">
          <div className="os-menubar-left">
            <span className="os-brand">
              <span className="os-logo-mark" />
              MohitOS
            </span>
            <span className="os-menubar-app">{activeId ? appById[activeId].title : 'Desktop'}</span>
          </div>
          <div className="os-menubar-right">
            <a href="/classic" className="os-menubar-link">
              Classic site
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="os-menubar-link hide-sm">
              Resume
            </a>
            <span className="os-menubar-time">{time}</span>
          </div>
        </header>

        <main className="os-desktop" ref={desk}>
          <DotField />
          <div className="os-glow" aria-hidden="true" />
          <div className="os-watermark" aria-hidden="true">
            MOHIT M B<span className="accent">.</span>
          </div>

          <nav className="os-icons" aria-label="Apps">
            {APPS.map((a, i) => (
              <motion.button
                key={a.id}
                className="os-desk-icon"
                onClick={() => openApp(a.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.04 }}
              >
                <AppIcon id={a.id} size={mobile ? 'lg' : 'md'} />
                <span>{a.title}</span>
              </motion.button>
            ))}
          </nav>

          <Widgets openApp={openApp} />

          <AnimatePresence>
            {Object.entries(wins).map(([id, st]) => (
              <Window
                key={id}
                id={id}
                st={st}
                active={id === activeId}
                mobile={mobile}
                bounds={desk}
                ops={ops}
              >
                {renderApp(id)}
              </Window>
            ))}
          </AnimatePresence>

          <Dock apps={mobile ? DOCK_PHONE : DOCK} running={Object.keys(wins)} onOpen={openApp} />
        </main>

        <AnimatePresence>{booting && <Boot onDone={finishBoot} />}</AnimatePresence>
      </div>
    </MotionConfig>
  )
}
