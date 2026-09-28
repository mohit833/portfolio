import { motion } from 'framer-motion'
import { caseStudy } from '../data'
import { Reveal, SectionHeading, ease } from './motion'

function BeforePanel({ calls }) {
  return (
    <div className="case-panel is-before">
      <header>
        <span className="mono">Before</span>
        <h3>A stack of Swagger calls</h3>
      </header>
      <ul className="case-calls" aria-hidden="true">
        {calls.map((c, i) => (
          <li key={c}>
            <span className="mono case-step">{i + 1}</span>
            <code>{c}</code>
          </li>
        ))}
      </ul>
      <p className="case-note">Run by hand, in the right order, every single time.</p>
    </div>
  )
}

function AfterPanel({ chain }) {
  return (
    <div className="case-panel is-after">
      <header>
        <span className="mono accent">After</span>
        <h3>One form, one call</h3>
      </header>

      <div className="case-form" aria-hidden="true">
        <span className="case-field">Customer</span>
        <span className="case-field">Beta features</span>
        <span className="case-submit">Onboard</span>
      </div>

      <div className="case-chain" aria-hidden="true">
        {chain.map((step, i) => (
          <motion.div
            className="case-link"
            key={step}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.12, ease }}
          >
            <span className="case-dot" />
            {step}
          </motion.div>
        ))}
      </div>
      <p className="case-note">Handled once, the same way, behind a single endpoint.</p>
    </div>
  )
}

export default function CaseStudy() {
  return (
    <section className="section" id="case-study">
      <SectionHeading index="03" label="Case study" title={caseStudy.title} />
      <Reveal className="case-intro">
        <p>{caseStudy.intro}</p>
      </Reveal>

      <Reveal className="case-panels">
        <BeforePanel calls={caseStudy.before} />
        <span className="case-arrow" aria-hidden="true">
          →
        </span>
        <AfterPanel chain={caseStudy.after} />
      </Reveal>

      <div className="case-notes">
        {caseStudy.notes.map((n, i) => (
          <Reveal className="case-block" key={n.title} delay={i * 0.08}>
            <span className="mono accent">0{i + 1}</span>
            <h3>{n.title}</h3>
            <p>{n.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
