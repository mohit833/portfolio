// The portfolio assistant. Claude answers questions about Mohit and decides,
// through a tool call, which section of the site to open for the visitor.
import Anthropic from '@anthropic-ai/sdk'
import {
  about,
  beyond,
  caseStudy,
  education,
  experience,
  expertise,
  profile,
  projects,
  recognition,
  skills,
  stats,
  work,
} from '../src/data.js'

const MODEL = 'claude-opus-5'
const SECTIONS = ['about', 'skills', 'case-study', 'impact', 'experience', 'work', 'recognition', 'beyond', 'contact']

// Abuse guards. Per-instance, so best effort — enough for a portfolio.
const MAX_QUESTION_CHARS = 500
const MAX_HISTORY = 8
const PER_IP_PER_HOUR = 20
const GLOBAL_PER_DAY = 500
const hits = new Map()
let day = new Date().toDateString()
let dayCount = 0

function allowed(ip) {
  const now = Date.now()
  const today = new Date().toDateString()
  if (today !== day) {
    day = today
    dayCount = 0
  }
  if (++dayCount > GLOBAL_PER_DAY) return false
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3600_000)
  if (recent.length >= PER_IP_PER_HOUR) return false
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return true
}

const list = (items) => items.map((i) => `- ${i}`).join('\n')

// Everything the assistant is allowed to know, built from the site's own content.
function buildProfile() {
  return [
    `Name: ${profile.name}. Role: ${profile.role} at ${profile.company}, ${profile.location}.`,
    `Email: ${profile.email}. Links: ${profile.links.map((l) => `${l.label} ${l.href}`).join(', ')}.`,
    `\nSummary: ${about.statement}\n${about.body.join('\n')}`,
    `\nNumbers:\n${list(stats.map((s) => `${s.prefix || ''}${s.value}${s.suffix || ''} — ${s.label}`))}`,
    `\nWhat he does:\n${expertise.map((e) => `- ${e.title}: ${e.body}`).join('\n')}`,
    `\nExperience:\n${experience
      .map((r) => `- ${r.role}, ${r.company} (${r.period}):\n${r.points.map((p) => `    · ${p}`).join('\n')}`)
      .join('\n')}`,
    `\nCase study — ${caseStudy.title.replace('\n', ' ')}: ${caseStudy.intro} ${caseStudy.notes
      .map((n) => `${n.title}: ${n.body}`)
      .join(' ')}`,
    `\nWork at Esko:\n${work.map((w) => `- ${w.title} (${w.kind}): ${w.description}`).join('\n')}`,
    `\nCollege projects:\n${projects.map((p) => `- ${p.title}: ${p.description}`).join('\n')}`,
    `\nAwards:\n${recognition
      .map((a) => `- ${a.title}${a.badge ? ` ${a.badge}` : ''} (${a.org}): ${a.detail || (a.points || []).join(' ')}`)
      .join('\n')}`,
    `\nOutside work:\n${beyond.map((b) => `- ${b.title} (${b.period}): ${b.points.join(' ')}`).join('\n')}`,
    `\nEducation: ${education.degree}, ${education.school}, ${education.period}, ${education.score}.`,
    `\nSkills: ${skills.join(', ')}.`,
  ].join('\n')
}

const SYSTEM = `You are the assistant on ${profile.name}'s portfolio site. Visitors are usually recruiters, hiring managers or engineers.

Answer questions about Mohit using only the profile below. Speak about him in the third person, warmly but plainly. Keep answers to two or three sentences unless asked for detail. Never invent facts, numbers, employers or technologies: if the profile does not cover something, say so and suggest emailing him.

His employer's code and product screenshots are confidential, so never offer them; point to the descriptions and diagrams on the site instead.

When a section of the site shows what you are describing, call the open_section tool so it opens for the visitor while you answer. Call it at most once per reply, and only when it genuinely matches.

PROFILE
${buildProfile()}`

const TOOLS = [
  {
    name: 'open_section',
    description: 'Open a section of the portfolio for the visitor so they can see what the answer refers to.',
    input_schema: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          enum: SECTIONS,
          description:
            'about: who he is and the numbers. skills: what he does, including the multi-agent system diagram. case-study: the onboarding API work. impact: security findings, tests, API calls. experience: the Esko timeline. work: projects he shipped. recognition: awards. beyond: community and education. contact: email and links.',
        },
      },
      required: ['section'],
      additionalProperties: false,
    },
    strict: true,
  },
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' })
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'assistant_offline' })
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  if (!allowed(ip)) {
    return res.status(429).json({ error: 'Too many questions for now. Please email him instead.' })
  }

  try {
    const incoming = Array.isArray(req.body?.messages) ? req.body.messages : []
    const messages = incoming
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_QUESTION_CHARS) }))

    if (!messages.length || messages[messages.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'Ask a question first.' })
    }

    const client = new Anthropic()
    const request = {
      model: MODEL,
      max_tokens: 700,
      // Short factual answers: low effort keeps it quick and cheap.
      output_config: { effort: 'low' },
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      tools: TOOLS,
      messages,
    }

    let response = await client.messages.create(request)
    let section = null

    // One tool round: the model opens a section, then finishes its sentence.
    const toolUse = response.content.find((b) => b.type === 'tool_use')
    if (toolUse) {
      section = SECTIONS.includes(toolUse.input?.section) ? toolUse.input.section : null
      response = await client.messages.create({
        ...request,
        messages: [
          ...messages,
          { role: 'assistant', content: response.content },
          {
            role: 'user',
            content: [
              {
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: section ? `Opened the ${section} section.` : 'That section does not exist.',
              },
            ],
          },
        ],
      })
    }

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join(' ')
      .trim()

    if (response.stop_reason === 'refusal' || !text) {
      return res.status(200).json({
        text: `I could not answer that one. Email him at ${profile.email} and he will reply himself.`,
        section: null,
      })
    }

    return res.status(200).json({ text, section, model: response.model })
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: 'Busy right now — try again in a moment.' })
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return res.status(503).json({ error: 'assistant_offline' })
    }
    console.error('assistant error:', error?.message)
    return res.status(500).json({ error: 'Something went wrong answering that.' })
  }
}
