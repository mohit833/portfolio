import { motion } from 'framer-motion'
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

const VISUALS = { traffic: TrafficVisual, ml: MlVisual, face: FaceVisual }

export default function Projects() {
  return (
    <section className="section" id="work">
      <SectionHeading index="03" label="Selected Work" title={'Things I\nhave built'} />
      <div className="projects">
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
                    <span>0{i + 1}</span>
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
      </div>
      <Reveal className="projects-more">
        <a
          className="link-arrow"
          href={profile.links.find((l) => l.label === 'GitHub').href}
          target="_blank"
          rel="noreferrer"
          data-cursor="Open"
        >
          More on GitHub <span aria-hidden="true">↗</span>
        </a>
      </Reveal>
    </section>
  )
}
