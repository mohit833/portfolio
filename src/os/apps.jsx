import { useState } from 'react'
import {
  about,
  beyond,
  education,
  experience,
  expertise,
  interests,
  languages,
  profile,
  projects,
  recognition,
  skills,
  stats,
} from '../data'
import { VISUALS } from '../components/Projects'
import { CountUp } from '../components/motion'

const GLYPHS = {
  about: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  experience: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  projects: 'M3 6h6l2 2h10v11H3z',
  awards: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8',
  skills: 'M13 3 5 14h6l-1 7 8-11h-6z',
  life: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
  agent: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z',
  terminal: 'M4 5h16v14H4zM7.5 10l3 2-3 2M12.5 15h4',
  resume: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  contact: 'M3 6h18v12H3zM3 7l9 6 9-6',
}

// Every app on the desktop. w/h are the preferred window size on large screens.
export const APPS = [
  { id: 'about', title: 'About Me', w: 760, h: 560, tint: '#c8ff3d' },
  { id: 'experience', title: 'Experience', w: 680, h: 620, tint: '#6ee7ff' },
  { id: 'projects', title: 'Projects', w: 900, h: 580, tint: '#ff8fd0' },
  { id: 'awards', title: 'Awards', w: 760, h: 560, tint: '#ffd166' },
  { id: 'skills', title: 'Skills', w: 720, h: 580, tint: '#a78bfa' },
  { id: 'life', title: 'Beyond Code', w: 700, h: 560, tint: '#ff8a65' },
  { id: 'agent', title: 'Orbit', w: 440, h: 620, tint: '#c8ff3d', hero: true },
  { id: 'terminal', title: 'Terminal', w: 640, h: 420, tint: '#d7d6d0' },
  { id: 'resume', title: 'Resume.pdf', w: 760, h: 680, tint: '#f0efe9' },
  { id: 'contact', title: 'Contact', w: 480, h: 460, tint: '#6ee7ff' },
]
export const appById = Object.fromEntries(APPS.map((a) => [a.id, a]))

export function AppIcon({ id, size = 'md' }) {
  const app = appById[id]
  return (
    <span className={`os-icon os-icon-${size}${app.hero ? ' is-hero' : ''}`} style={{ '--tint': app.tint }}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={GLYPHS[id]} />
      </svg>
    </span>
  )
}

function Tags({ items }) {
  return (
    <ul className="tags">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}

function Points({ items }) {
  return (
    <ul className="job-points">
      {items.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  )
}

function AboutApp({ openApp }) {
  return (
    <div className="app-about">
      <img className="app-about-photo" src={profile.photo.src} alt={profile.photo.alt} width="960" height="1200" />
      <div className="app-about-text">
        <span className="mono accent">Hello, I'm</span>
        <h2 className="app-h1">{profile.name}</h2>
        <p className="app-lead">
          {profile.role} at {profile.company} · {profile.location}
        </p>
        <p className="app-statement">{about.statement}</p>
        {about.body.map((p) => (
          <p className="app-body" key={p}>
            {p}
          </p>
        ))}
        <div className="app-stats">
          {stats.map((s) => (
            <div className="app-stat" key={s.label}>
              <strong>
                <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="app-actions">
          <button className="btn btn-primary btn-small-solid" onClick={() => openApp('agent')}>
            Ask Orbit, my AI agent ✦
          </button>
          <button className="btn btn-ghost btn-small-solid" onClick={() => openApp('experience')}>
            See experience
          </button>
        </div>
      </div>
    </div>
  )
}

function ExperienceApp() {
  return (
    <div className="app-pad">
      <span className="mono muted">One company, three chapters</span>
      <div className="app-timeline">
        {experience.map((job, i) => (
          <article className="app-job" key={job.role}>
            <span className={`app-job-node${i === 0 ? ' is-current' : ''}`} />
            <div className="app-job-head">
              <h3>{job.role}</h3>
              <span className="mono accent">{job.period}</span>
            </div>
            <span className="mono muted">
              {job.company} · {job.location}
            </span>
            <Points items={job.points} />
            <Tags items={job.tags} />
          </article>
        ))}
      </div>
    </div>
  )
}

function ProjectsApp() {
  const [active, setActive] = useState(0)
  const p = projects[active]
  const Visual = VISUALS[p.visual]
  return (
    <div className="app-finder">
      <aside className="app-finder-side">
        <span className="mono muted">Projects</span>
        {projects.map((proj, i) => (
          <button
            key={proj.title}
            className={`app-finder-item${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            <span className="mono">0{i + 1}</span>
            {proj.title}
          </button>
        ))}
        <a className="app-finder-more" href={profile.links[0].href} target="_blank" rel="noreferrer">
          More on GitHub ↗
        </a>
      </aside>
      <div className="app-finder-main" key={p.title}>
        <div className="app-finder-visual">
          <Visual />
        </div>
        <div className="app-pad">
          <span className="mono muted">{p.kind}</span>
          <h3 className="app-h2">{p.title}</h3>
          <p className="app-body">{p.description}</p>
          <Tags items={p.tags} />
        </div>
      </div>
    </div>
  )
}

function AwardsApp() {
  return (
    <div className="app-pad app-awards">
      {recognition.map((a) => (
        <article className={`app-award${a.featured ? ' is-featured' : ''}`} key={a.title}>
          <span className="app-award-icon">{a.featured ? '★' : '✦'}</span>
          <h3>
            {a.title}
            {a.badge && <span className="award-badge">{a.badge}</span>}
          </h3>
          {a.detail && <p>{a.detail}</p>}
          {a.points && <Points items={a.points} />}
          <span className="mono muted">{a.org}</span>
        </article>
      ))}
    </div>
  )
}

function SkillsApp() {
  return (
    <div className="app-pad">
      <div className="app-expertise">
        {expertise.map((e, i) => (
          <article key={e.title}>
            <span className="mono accent">0{i + 1}</span>
            <h3>{e.title}</h3>
            <p className="app-body">{e.body}</p>
          </article>
        ))}
      </div>
      <span className="mono muted">Toolkit</span>
      <ul className="chips app-chips">
        {skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  )
}

function LifeApp() {
  return (
    <div className="app-pad app-life">
      {beyond.map((b) => (
        <article key={b.title}>
          <div className="app-job-head">
            <h3>{b.title}</h3>
            <span className="mono muted">{b.period}</span>
          </div>
          <Points items={b.points} />
        </article>
      ))}
      <article>
        <span className="mono muted">Education</span>
        <h3>{education.degree}</h3>
        <p className="app-body">
          {education.school} · {education.period}
        </p>
        <span className="pill">{education.score}</span>
      </article>
      <article>
        <span className="mono muted">When I'm offline</span>
        <ul className="chips app-chips">
          {interests.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <span className="mono muted">I speak</span>
        <ul className="chips app-chips">
          {languages.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </article>
    </div>
  )
}

function ResumeApp() {
  return (
    <div className="app-resume">
      <div className="app-resume-bar">
        <span className="mono muted">Mohit_MB_Resume.pdf</span>
        <div className="app-actions">
          <a className="btn btn-ghost btn-small-solid" href={profile.resume} target="_blank" rel="noreferrer">
            Open in new tab ↗
          </a>
          <a className="btn btn-primary btn-small-solid" href={profile.resume} download>
            Download
          </a>
        </div>
      </div>
      <iframe title="Resume of Mohit M B" src={`${profile.resume}#view=FitH`} />
    </div>
  )
}

function ContactApp() {
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
    <div className="app-pad app-contact">
      <h2 className="app-h1">
        Let's build
        <br />
        something <em>great.</em>
      </h2>
      <a className="app-contact-email" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <div className="app-actions">
        <a className="btn btn-primary btn-small-solid" href={`mailto:${profile.email}`}>
          Send an email
        </a>
        <button className="btn btn-ghost btn-small-solid" onClick={copy}>
          {copied ? 'Copied ✓' : 'Copy email'}
        </button>
      </div>
      <div className="app-links">
        {profile.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="link-arrow">
            {l.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export const APP_VIEWS = {
  about: AboutApp,
  experience: ExperienceApp,
  projects: ProjectsApp,
  awards: AwardsApp,
  skills: SkillsApp,
  life: LifeApp,
  resume: ResumeApp,
  contact: ContactApp,
}
