import { motion } from 'framer-motion'
import { ease } from './motion'

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

function AgentsVisual() {
  const agents = [0, 1, 2]
  return (
    <div className="viz viz-agents" aria-hidden="true">
      <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet">
        <g className="viz-agents-links">
          {agents.map((i) => (
            <path key={i} d={`M126 110 C 164 110, 172 ${40 + i * 70}, 210 ${40 + i * 70}`} />
          ))}
        </g>
        <rect className="viz-node is-hub" x="26" y="88" width="100" height="44" rx="10" />
        <text x="76" y="115" textAnchor="middle">orchestrator</text>
        {agents.map((i) => (
          <g key={i}>
            <rect className="viz-node" x="210" y={18 + i * 70} width="76" height="44" rx="10" />
            <text x="248" y={45 + i * 70} textAnchor="middle">agent {i + 1}</text>
          </g>
        ))}
        {agents.map((i) => (
          <circle key={i} className="viz-pulse" r="3.5">
            <animateMotion
              dur={`${2.2 + i * 0.4}s`}
              repeatCount="indefinite"
              path={`M126 110 C 164 110, 172 ${40 + i * 70}, 210 ${40 + i * 70}`}
            />
          </circle>
        ))}
      </svg>
      <span className="viz-tag mono">mcp · python</span>
    </div>
  )
}

function ApiVisual() {
  const calls = [
    { verb: 'POST', path: '/customers', code: '201' },
    { verb: 'POST', path: '/subscriptions', code: '201' },
    { verb: 'GET', path: '/iam/roles', code: '200' },
    { verb: 'PATCH', path: '/sites/{id}', code: '200' },
  ]
  return (
    <div className="viz viz-api" aria-hidden="true">
      <div className="viz-api-list">
        {calls.map((c, i) => (
          <motion.div
            className="viz-api-row"
            key={c.path}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease }}
          >
            <span className={`viz-verb is-${c.verb.toLowerCase()}`}>{c.verb}</span>
            <span className="viz-path">{c.path}</span>
            <span className="viz-code">{c.code}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DesignVisual() {
  return (
    <div className="viz viz-design" aria-hidden="true">
      <div className="viz-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            className={`viz-cell v${i % 4}`}
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.05, ease }}
          />
        ))}
      </div>
      <span className="viz-tag mono">20+ components</span>
    </div>
  )
}

function ShieldVisual() {
  return (
    <div className="viz viz-shield" aria-hidden="true">
      <svg viewBox="0 0 120 130">
        <path className="viz-shield-body" d="M60 8 105 26v38c0 30-20 48-45 58-25-10-45-28-45-58V26z" />
        <path className="viz-shield-tick" d="M40 66 55 81 84 50" />
      </svg>
      <span className="viz-tag mono">0 high severity</span>
    </div>
  )
}

export const VISUALS = {
  traffic: TrafficVisual,
  ml: MlVisual,
  face: FaceVisual,
  agents: AgentsVisual,
  api: ApiVisual,
  design: DesignVisual,
  shield: ShieldVisual,
}
