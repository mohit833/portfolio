import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  about,
  beyond,
  education,
  experience,
  expertise,
  interests,
  languages,
  profile,
  recognition,
  skills,
  stats,
} from '../data'
import { CountUp, Magnetic, Reveal, SectionHeading, lineUp, spotlight } from './motion'

export function Marquee() {
  const rows = [skills, [...skills].reverse()]
  return (
    <div className="marquee-wrap" aria-label="Skills">
      {rows.map((row, r) => (
        <div className={`marquee${r ? ' reverse' : ''}`} key={r}>
          <div className="marquee-track">
            {[...row, ...row].map((s, i) => (
              <span className="marquee-item" key={i} aria-hidden={i >= row.length}>
                {s}
                <span className="star">✦</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return <motion.span style={{ opacity }}>{children}</motion.span>
}

function ScrollText({ text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p className="statement" ref={ref}>
      {words.map((w, i) => (
        <span key={i}>
          <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>{' '}
        </span>
      ))}
    </p>
  )
}

export function About() {
  return (
    <section className="section" id="about">
      <SectionHeading index="01" label="About" title={'Engineer by trade,\ncraftsman by habit'} />
      <ScrollText text={about.statement} />
      <div className="about-body">
        {about.body.map((p, i) => (
          <Reveal as="p" key={i} delay={i * 0.1}>
            {p}
          </Reveal>
        ))}
      </div>
      <div className="stats">
        {stats.map((s, i) => (
          <Reveal className="stat" key={s.label} delay={(i % 3) * 0.08}>
            <div className="stat-value">
              <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </div>
            <div className="stat-label">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Expertise() {
  return (
    <section className="section" id="expertise">
      <SectionHeading index="02" label="What I do" title={'Four things\nI do well'} />
      <div className="expertise">
        {expertise.map((e, i) => (
          <Reveal className="xp-row" key={e.title} delay={i * 0.05}>
            <span className="mono xp-num">0{i + 1}</span>
            <h3 className="xp-title">{e.title}</h3>
            <div className="xp-detail">
              <p>{e.body}</p>
              <ul className="tags">
                {e.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <span className="xp-arrow" aria-hidden="true">
              ↗
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] })
  return (
    <section className="section" id="experience">
      <SectionHeading index="03" label="Experience" title={'One company,\nthree chapters'} />
      <div className="timeline" ref={ref}>
        <div className="timeline-rail" aria-hidden="true">
          <motion.div className="timeline-fill" style={{ scaleY: scrollYProgress }} />
        </div>
        {experience.map((job, i) => (
          <Reveal className="job" key={job.role}>
            <span className={`job-node${i === 0 ? ' is-current' : ''}`} aria-hidden="true" />
            <div className="job-side">
              <span className="mono accent">{job.period}</span>
              <span className="mono muted">{job.location}</span>
            </div>
            <div className="job-card" onPointerMove={spotlight}>
              <h3>
                {job.role} <span className="muted">· {job.company}</span>
              </h3>
              <ul className="job-points">
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <ul className="tags">
                {job.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Recognition() {
  return (
    <section className="section" id="recognition">
      <SectionHeading index="05" label="Recognition" title={'Awards &\nmilestones'} />
      <div className="awards">
        {recognition.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.08} className={`award${a.featured ? ' is-featured' : ''}`}>
            <div className="award-inner" onPointerMove={spotlight}>
              <span className="award-icon" aria-hidden="true">
                {a.featured ? '★' : '✦'}
              </span>
              <h3>{a.title}</h3>
              <p>{a.detail}</p>
              <span className="mono muted">{a.org}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Beyond() {
  return (
    <section className="section" id="beyond">
      <SectionHeading index="06" label="Beyond the code" title={'Community,\ncuriosity & more'} />
      <div className="beyond">
        {beyond.map((b, i) => (
          <Reveal className="beyond-card" key={b.title} delay={i * 0.1}>
            <div className="beyond-head">
              <h3>{b.title}</h3>
              <span className="mono muted">{b.period}</span>
            </div>
            <ul className="job-points">
              {b.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Reveal>
        ))}
        <Reveal className="beyond-card edu" delay={0.1}>
          <span className="mono muted">Education</span>
          <h3>{education.degree}</h3>
          <p>{education.school}</p>
          <div className="edu-foot">
            <span className="mono muted">{education.period}</span>
            <span className="pill">{education.score}</span>
          </div>
        </Reveal>
        <Reveal className="beyond-card" delay={0.15}>
          <span className="mono muted">When I'm offline</span>
          <ul className="chips">
            {interests.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <span className="mono muted">I speak</span>
          <ul className="chips">
            {languages.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <section className="contact" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <Reveal className="eyebrow">
        <span className="eyebrow-index">07</span>
        <span className="eyebrow-line" />
        <span>Contact</span>
      </Reveal>
      <motion.h2
        className="contact-title"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {["Let's build", 'something', 'great.'].map((line, i) => (
          <span className="line-mask" key={line}>
            <motion.span variants={lineUp} custom={i}>
              {i === 2 ? <em>{line}</em> : line}
            </motion.span>
          </span>
        ))}
      </motion.h2>
      <Reveal className="contact-actions" delay={0.2}>
        <Magnetic strength={0.25}>
          <a className="btn btn-primary btn-large" href={`mailto:${profile.email}`} data-cursor="Say hi">
            {profile.email}
          </a>
        </Magnetic>
        <button className="btn btn-ghost" onClick={copy}>
          {copied ? 'Copied ✓' : 'Copy email'}
        </button>
      </Reveal>
      <Reveal className="contact-links" delay={0.3}>
        {profile.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="link-arrow">
            {l.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
        <a href={profile.resume} target="_blank" rel="noreferrer" className="link-arrow">
          Resume <span aria-hidden="true">↗</span>
        </a>
      </Reveal>
    </section>
  )
}
