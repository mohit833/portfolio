import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useSpring } from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]

// Line reveal for text inside a .line-mask. The parent must own whileInView,
// because the hidden line sits outside its clipped mask and never intersects.
export const lineUp = {
  hidden: { y: '110%' },
  visible: (i = 0) => ({ y: 0, transition: { duration: 1.05, delay: i * 0.09, ease } }),
}

export function Reveal({ children, delay = 0, y = 40, className, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Tag>
  )
}

export function SectionHeading({ index, label, title }) {
  return (
    <header className="section-heading">
      <Reveal className="eyebrow">
        <span className="eyebrow-index">{index}</span>
        <span className="eyebrow-line" />
        <span>{label}</span>
      </Reveal>
      <motion.h2
        className="section-title"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {title.split('\n').map((line, i) => (
          <span className="line-mask" key={i}>
            <motion.span variants={lineUp} custom={i}>
              {line}
            </motion.span>
          </span>
        ))}
      </motion.h2>
    </header>
  )
}

export function CountUp({ value, decimals = 0, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [display, setDisplay] = useState((0).toFixed(decimals))

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.8,
      ease,
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    })
    return () => controls.stop()
  }, [inView, value, decimals])

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

// Pulls its child toward the pointer while hovered.
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className="magnetic"
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}

// Sets --mx / --my CSS variables so a radial "spotlight" can follow the pointer.
export function spotlight(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}
