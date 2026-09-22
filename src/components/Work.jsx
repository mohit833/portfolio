import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { profile, projects, work } from '../data'
import { Reveal, SectionHeading, spotlight } from './motion'
import { VISUALS } from './visuals'

export default function Work() {
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
        <SectionHeading index="05" label="Selected Work" title={'What I have\nshipped'} />
      </div>
      <div ref={pin} className="work-pin" style={horizontal ? { height: `calc(100vh + ${distance}px)` } : undefined}>
        <div className="work-sticky">
          <motion.div ref={track} className="work-track" style={horizontal ? { x } : undefined}>
            {work.map((p, i) => {
              const Visual = VISUALS[p.visual]
              return (
                <Reveal key={p.title} className="project" as="article">
                  <div className="project-card" onPointerMove={spotlight}>
                    <div className="project-visual">
                      <Visual />
                    </div>
                    <div className="project-info">
                      <div className="project-meta mono">
                        <span>0{i + 1} / 0{work.length}</span>
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
            <a className="work-end" href="#contact" data-cursor="Ask me">
              <span className="mono muted">No public repo</span>
              <span className="work-end-title">
                Ask me about it <span aria-hidden="true">↗</span>
              </span>
              <span className="work-end-note">This work ships inside Esko products, so the code stays private.</span>
            </a>
          </motion.div>
          {horizontal && (
            <div className="work-progress" aria-hidden="true">
              <motion.span style={{ scaleX: scrollYProgress }} />
            </div>
          )}
        </div>
      </div>

      <div className="section earlier">
        <Reveal className="earlier-head">
          <span className="eyebrow">
            <span className="eyebrow-index">05.1</span>
            <span className="eyebrow-line" />
            <span>Earlier, at college</span>
          </span>
          <a className="link-arrow" href={github} target="_blank" rel="noreferrer" data-cursor="Open">
            These are on GitHub <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
        <div className="earlier-grid">
          {projects.map((p, i) => {
            const Visual = VISUALS[p.visual]
            return (
              <Reveal className="earlier-card" as="article" key={p.title} delay={i * 0.08}>
                <div className="earlier-visual">
                  <Visual />
                </div>
                <div className="earlier-body">
                  <span className="mono muted">{p.kind}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <ul className="tags">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
