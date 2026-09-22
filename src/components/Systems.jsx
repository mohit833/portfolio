import { useState } from 'react'
import { motion } from 'framer-motion'
import { agentFlow, expertise } from '../data'
import { Reveal, SectionHeading, ease } from './motion'

// Node boxes of the diagram, in viewBox units (1000 x 420).
const REQUEST = { x: 16, y: 180, w: 150, h: 58 }
const ORCH = { x: 224, y: 164, w: 186, h: 90 }
const AGENTS = [
  { x: 470, y: 28, w: 168, h: 64 },
  { x: 470, y: 177, w: 168, h: 64 },
  { x: 470, y: 326, w: 168, h: 64 },
]
const TOOLS = { x: 698, y: 164, w: 150, h: 90 }
const PLATFORM = { x: 890, y: 172, w: 96, h: 74 }

const cx = (b) => b.x + b.w / 2
const cy = (b) => b.y + b.h / 2
const curve = (from, to) =>
  `M${from.x + from.w} ${cy(from)} C ${from.x + from.w + 60} ${cy(from)}, ${to.x - 60} ${cy(to)}, ${to.x} ${cy(to)}`

function Node({ box, label, sub, id, active, onHover, variant = '' }) {
  return (
    <g
      className={`flow-node${variant ? ` is-${variant}` : ''}${active === id ? ' is-active' : ''}`}
      onMouseEnter={() => onHover(id)}
      onFocus={() => onHover(id)}
      onClick={() => onHover(id)}
      tabIndex={0}
      role="button"
      aria-label={label}
    >
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="14" />
      <text x={cx(box)} y={cy(box) + (sub ? -4 : 5)} textAnchor="middle">
        {label}
      </text>
      {sub && (
        <text className="flow-sub" x={cx(box)} y={cy(box) + 16} textAnchor="middle">
          {sub}
        </text>
      )}
    </g>
  )
}

function Flow() {
  const [active, setActive] = useState('orchestrator')
  const paths = [
    { id: 'in', d: curve(REQUEST, ORCH), dur: 2.4 },
    ...AGENTS.map((a, i) => ({ id: `a${i}`, d: curve(ORCH, a), dur: 2.6 + i * 0.3 })),
    ...AGENTS.map((a, i) => ({ id: `t${i}`, d: curve(a, TOOLS), dur: 2.8 + i * 0.25 })),
    { id: 'out', d: curve(TOOLS, PLATFORM), dur: 2.2 },
  ]
  const notes = {
    request: agentFlow.request,
    orchestrator: agentFlow.orchestrator,
    agent: { label: 'Specialised agents', note: agentFlow.agents[0].note },
    tools: agentFlow.tools,
    platform: agentFlow.platform,
  }
  const note = notes[active] ?? notes.orchestrator

  return (
    <div className="flow">
      <svg className="flow-svg" viewBox="0 0 1000 420" role="img" aria-label="Multi-agent system diagram">
        <g className="flow-links">
          {paths.map((p) => (
            <path key={p.id} d={p.d} />
          ))}
        </g>
        {paths.map((p) => (
          <circle className="flow-dot" r="4" key={p.id}>
            <animateMotion dur={`${p.dur}s`} repeatCount="indefinite" path={p.d} />
          </circle>
        ))}

        <Node box={REQUEST} id="request" label={agentFlow.request.label} active={active} onHover={setActive} />
        <Node
          box={ORCH}
          id="orchestrator"
          label="Orchestrator"
          sub="plans & delegates"
          variant="hub"
          active={active}
          onHover={setActive}
        />
        {AGENTS.map((box, i) => (
          <Node
            key={i}
            box={box}
            id="agent"
            label={`Agent ${i + 1}`}
            sub="specialised"
            active={active}
            onHover={setActive}
          />
        ))}
        <Node box={TOOLS} id="tools" label="MCP tools" sub="Python" variant="tools" active={active} onHover={setActive} />
        <Node box={PLATFORM} id="platform" label="Platform" active={active} onHover={setActive} />
      </svg>

      <ul className="flow-stack" aria-hidden="true">
        {['request', 'orchestrator', 'agent', 'tools', 'platform'].map((id) => (
          <li key={id} className={id === 'tools' ? 'is-mine' : ''}>
            <span className="mono">{notes[id].label}</span>
            <p>{notes[id].note}</p>
          </li>
        ))}
      </ul>

      <motion.p className="flow-note" key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <span className="mono accent">{note.label}</span>
        {note.note}
      </motion.p>
    </div>
  )
}

export default function Systems() {
  return (
    <section className="section" id="systems">
      <SectionHeading index="02" label="Systems" title={'The system\nI build for'} />
      <Reveal className="flow-intro">
        <p>
          At Esko I build the MCP tools behind a multi-agent AI system. A request arrives, an orchestrator agent plans
          the work, specialised agents pick it up, and my tools are how they actually touch the platform. Hover any part
          of it.
        </p>
      </Reveal>
      <Reveal>
        <Flow />
      </Reveal>

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
