import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { impact } from '../data'
import { Reveal, SectionHeading, ease } from './motion'

const TOTAL_DOTS = 108

// 100+ Veracode findings clearing from red to green.
function SecurityVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [fixed, setFixed] = useState(0)

  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setFixed((n) => (n >= TOTAL_DOTS ? (clearInterval(id), n) : n + 2)), 34)
    return () => clearInterval(id)
  }, [inView])

  return (
    <div className="impact-viz impact-security" ref={ref}>
      <div className="impact-dots" aria-hidden="true">
        {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
          <span key={i} className={i < fixed ? 'is-fixed' : ''} style={{ transitionDelay: `${(i % 12) * 12}ms` }} />
        ))}
      </div>
      <div className="impact-legend mono">
        <span>
          <i className="dot-open" /> open {Math.max(0, TOTAL_DOTS - fixed)}
        </span>
        <span>
          <i className="dot-fixed" /> resolved {Math.min(fixed, TOTAL_DOTS)}
        </span>
      </div>
    </div>
  )
}

const SUITES = [
  { name: 'onboarding.api.spec', count: 42 },
  { name: 'subscription.service.spec', count: 38 },
  { name: 'design-system.components.spec', count: 61 },
  { name: 'iam.integration.spec', count: 34 },
  { name: 'selenium.journeys.e2e', count: 25 },
]

// A test runner ticking green, one suite at a time.
function TestsVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [done, setDone] = useState(0)

  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setDone((n) => (n >= SUITES.length ? (clearInterval(id), n) : n + 1)), 520)
    return () => clearInterval(id)
  }, [inView])

  const passed = SUITES.slice(0, done).reduce((n, s) => n + s.count, 0)

  return (
    <div className="impact-viz impact-tests" ref={ref}>
      <ul>
        {SUITES.map((s, i) => (
          <li key={s.name} className={i < done ? 'is-done' : ''}>
            <span className="impact-check">{i < done ? '✓' : <i className="impact-spin" />}</span>
            <span className="impact-suite">{s.name}</span>
            <span className="impact-count">{s.count}</span>
          </li>
        ))}
      </ul>
      <div className="impact-bar">
        <motion.span animate={{ scaleX: done / SUITES.length }} transition={{ duration: 0.4, ease }} />
      </div>
      <span className="impact-legend mono">
        {passed} passed · 0 failed
      </span>
    </div>
  )
}

// Before and after: the same screen, half the calls.
function ApiVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const bars = [
    { label: 'before', calls: 12, cls: 'is-before' },
    { label: 'after', calls: 6, cls: 'is-after' },
  ]
  return (
    <div className="impact-viz impact-api" ref={ref}>
      {bars.map((b, bi) => (
        <div className={`impact-lane ${b.cls}`} key={b.label}>
          <span className="mono">{b.label}</span>
          <div className="impact-calls">
            {Array.from({ length: b.calls }).map((_, i) => (
              <motion.i
                key={i}
                initial={{ opacity: 0, scaleY: 0.2 }}
                animate={inView ? { opacity: 1, scaleY: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + bi * 0.5 + i * 0.05, ease }}
              />
            ))}
          </div>
          <span className="mono impact-calls-n">{b.calls} calls</span>
        </div>
      ))}
    </div>
  )
}

const VIZ = { security: SecurityVisual, tests: TestsVisual, api: ApiVisual }

export default function Impact() {
  return (
    <section className="section" id="impact">
      <SectionHeading index="03" label="Proof" title={'Numbers, with\nthe receipts'} />
      <div className="impact">
        {impact.map((item, i) => {
          const Viz = VIZ[item.kind]
          return (
            <Reveal className="impact-card" key={item.title} delay={i * 0.08}>
              <div className="impact-head">
                <strong>{item.value}</strong>
                <h3>{item.title}</h3>
              </div>
              <Viz />
              <p>{item.body}</p>
              <span className="mono muted">{item.foot}</span>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
