import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { profile, projects } from '../data'
import { Reveal, SectionHeading, spotlight } from './motion'

function TrafficVisual() {
  return (
    <div className="viz viz-traffic" aria-hidden="true">
      <div className="road">
        <span className="lane" />
        <span className="lane" />
      </div>
      <div className="bbox bbox-a"><em>CAR · ID 04</em></div>
      <div className="bbox bbox-b"><em>TRUCK · ID 11</em></div>
      <div className="bbox bbox-c"><em>PERSON · ID 07</em></div>
      <svg className="trail" viewBox="0 0 400 240" preserveAspectRatio="none">
        <path d="M-10 190 C 80 170, 160 120, 240 110 S 380 60, 420 40" />
      </svg>
      <span className="rec mono">● LIVE</span>
    </div>
  )
}

function MlVisual() {
  const bars = [
    { label: 'Model A', h: 58 },
    { label: 'Model B', h: 66 },
    { label: 'Model C', h: 62 },
    { label: 'Ensemble', h: 88, best: true },
  ]
  return (
    <div className="viz viz-ml" aria-hidden="true">
      <div className="bars">
        {bars.map((b, i) => (
          <div className="bar-col" key={b.label}>
            <motion.div
              className={`bar${b.best ? ' is-best' : ''}`}
              initial={{ height: 0 }}
              whileInView={{ height: `${b.h}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="mono">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FaceVisual() {
  return (
    <div className="viz viz-face" aria-hidden="true">
      <div className="scan-frame">
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <svg viewBox="0 0 100 120" className="face">
          <ellipse cx="50" cy="58" rx="30" ry="40" />
          <circle cx="38" cy="50" r="3.5" />
          <circle cx="62" cy="50" r="3.5" />
          <path d="M50 56 L47 70 L53 70" />
          <path d="M40 82 Q50 89 60 82" />
        </svg>
        <span className="scan-line" />
      </div>
      <span className="face-ok mono">✓ Attendance logged</span>
    </div>
  )
}

export const VISUALS = { traffic: TrafficVisual, ml: MlVisual, face: FaceVisual }

export default function Projects() {
  const pin = useRef(null)
  const track = useRef(null)
  const [horizontal, setHorizontal] = useState(false)
  const [distance, setDistance] = useState(0)
  const distanceMv = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] })
  const x = useTransform([scrollYProgress, distanceMv], ([v, d]) => -v * d)
  const github = profile.links.find((l) => l.label === 'GitHub').href

  // Pin the section and scroll the cards sideways on large screens only.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    const update = () => {
      setHorizontal(mq.matches)
      if (mq.matches && track.current) {
        const d = Math.max(0, track.current.scrollWidth - document.documentElement.clientWidth)
        setDistance(d)
        distanceMv.set(d)
      }
    }
    update()
    mq.addEventListener('change', update)
    const ro = new ResizeObserver(update)
    ro.observe(track.current)
    return () => {
      mq.removeEventListener('change', update)
      ro.disconnect()
    }
  }, [distanceMv])

  return (
    <section className={`work${horizontal ? ' is-horizontal' : ''}`} id="work">
      <div className="section work-head">
        <SectionHeading index="04" label="Selected Work" title={'Things I\nhave built'} />
      </div>
      <div ref={pin} className="work-pin" style={horizontal ? { height: `calc(100vh + ${distance}px)` } : undefined}>
        <div className="work-sticky">
          <motion.div ref={track} className="work-track" style={horizontal ? { x } : undefined}>
            {projects.map((p, i) => {
              const Visual = VISUALS[p.visual]
              return (
                <Reveal key={p.title} className="project" as="article">
                  <div className="project-card" onPointerMove={spotlight}>
                    <div className="project-visual">
                      <Visual />
                    </div>
                    <div className="project-info">
                      <div className="project-meta mono">
                        <span>0{i + 1} / 0{projects.length}</span>
                        <span>{p.kind}</span>
                      </div>
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                      <ul className="tags">
                        {p.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              )
            })}
            <a className="work-end" href={github} target="_blank" rel="noreferrer" data-cursor="Open">
              <span className="mono muted">More projects</span>
              <span className="work-end-title">
                See more on GitHub <span aria-hidden="true">↗</span>
              </span>
            </a>
          </motion.div>
          {horizontal && (
            <div className="work-progress" aria-hidden="true">
              <motion.span style={{ scaleX: scrollYProgress }} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
