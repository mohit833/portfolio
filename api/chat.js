// The portfolio assistant. The model answers questions about Mohit and decides,
// through a tool call, which section of the site to open for the visitor.
//
// Providers are tried in order: Claude, then Gemini, then (client-side) a short
// scripted profile. Whichever keys exist decide how far the cascade gets.
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenAI } from '@google/genai'
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

const CLAUDE_MODEL = 'claude-opus-5'
// Concrete models rather than the shared -latest alias, which gets busy.
const GEMINI_MODELS = ['gemini-flash-lite-latest', 'gemini-3.5-flash', 'gemma-4-26b-a4b-it']
const BUSY = /UNAVAILABLE|high demand|overloaded|RESOURCE_EXHAUSTED|INTERNAL|not found|no longer available|429|500|503|404/i
const MAX_TOKENS = 1400 // room for the model's thinking plus the answer
const ATTEMPT_MS = 11000 // per model attempt
const DEADLINE_MS = 26000 // whole request: after this the panel uses its scripted profile
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

const SECTION_HINT =
  'about: who he is and the numbers. skills: what he does, including the multi-agent system diagram. ' +
  'case-study: the onboarding API work. impact: security findings, tests, API calls. experience: the Esko ' +
  'timeline. work: projects he shipped. recognition: awards. beyond: community and education. contact: email and links.'

const cleanSection = (value) => (SECTIONS.includes(value) ? value : null)

async function askClaude(messages) {
  const client = new Anthropic()
  const request = {
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
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
    section = cleanSection(toolUse.input?.section)
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

  if (response.stop_reason === 'refusal') return { text: '', section: null }
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join(' ')
    .trim()
  return { text, section }
}

// Never let a slow provider hang the request: the panel would just spin.
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms)),
  ])
}

async function askGemini(messages) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY })
  const baseContents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const functionDeclarations = [
    {
      name: 'open_section',
      description: 'Open a section of the portfolio for the visitor so they can see what the answer refers to.',
      parametersJsonSchema: {
        type: 'object',
        properties: { section: { type: 'string', enum: SECTIONS, description: SECTION_HINT } },
        required: ['section'],
      },
    },
  ]

  let lastError = null
  const deadline = Date.now() + DEADLINE_MS
  for (const model of GEMINI_MODELS) {
    const budget = Math.min(ATTEMPT_MS, deadline - Date.now())
    if (budget < 4000) break // not enough time left to be worth trying
    // Gemma has no system instruction or tool calling: carry the profile in the
    // first message and accept that it cannot open sections.
    const gemma = model.startsWith('gemma')
    const contents = gemma
      ? baseContents.map((c, i) =>
          i === 0 ? { ...c, parts: [{ text: `${SYSTEM}\n\nVisitor question: ${c.parts[0].text}` }] } : c,
        )
      : baseContents
    const config = gemma
      ? { maxOutputTokens: MAX_TOKENS }
      : {
          systemInstruction: SYSTEM,
          maxOutputTokens: MAX_TOKENS,
          tools: [{ functionDeclarations }],
        }

    try {
      let response = await withTimeout(
        ai.models.generateContent({ model, contents, config }),
        budget,
        model,
      )
      let section = null

      const call = gemma ? null : response.functionCalls?.[0]
      if (call) {
        section = cleanSection(call.args?.section)
        response = await withTimeout(
          ai.models.generateContent({
            model,
            config,
            contents: [
              ...contents,
              // The model's own turn, replayed as-is: it carries the thought
              // signature Gemini 3 requires alongside a function call.
              response.candidates?.[0]?.content ?? { role: 'model', parts: [{ functionCall: call }] },
              {
                role: 'user',
                parts: [
                  {
                    functionResponse: {
                      name: call.name,
                      response: {
                        result: section ? `Opened the ${section} section.` : 'That section does not exist.',
                      },
                    },
                  },
                ],
              },
            ],
          }),
          Math.max(4000, deadline - Date.now()),
          model,
        )
      }

      const text = (response.text || '').trim()
      if (text) return { text, section }
      lastError = new Error(`${model} returned no text`)
    } catch (error) {
      lastError = error
      const message = String(error?.message || '')
      // Busy, missing, or slow: try the next model. A real fault should surface.
      if (!BUSY.test(message) && !/timed out/.test(message)) throw error
    }
  }
  throw lastError || new Error('no Gemini model answered')
}

const PROVIDERS = [
  { id: 'claude', enabled: () => !!process.env.ANTHROPIC_API_KEY, run: askClaude },
  { id: 'gemini', enabled: () => !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY), run: askGemini },
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' })

  const available = PROVIDERS.filter((p) => p.enabled())
  if (!available.length) return res.status(503).json({ error: 'assistant_offline' })

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  if (!allowed(ip)) {
    return res.status(429).json({ error: 'Too many questions for now. Please email him instead.' })
  }

  const incoming = Array.isArray(req.body?.messages) ? req.body.messages : []
  const messages = incoming
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_QUESTION_CHARS) }))

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Ask a question first.' })
  }

  // Walk the cascade: the first provider that answers wins.
  let rateLimited = false
  const failures = []
  for (const provider of available) {
    try {
      const { text, section } = await provider.run(messages)
      if (text) return res.status(200).json({ text, section, via: provider.id })
      console.warn(`${provider.id} returned nothing; trying the next provider`)
    } catch (error) {
      rateLimited = rateLimited || error?.status === 429
      failures.push(`${provider.id}: ${String(error?.message || error).slice(0, 300)}`)
      console.error(`${provider.id} failed:`, error?.message)
    }
  }

  if (rateLimited) {
    return res.status(429).json({ error: 'Busy right now — try again in a moment.' })
  }
  // Nothing answered: the panel falls back to its scripted profile.
  return res.status(503).json({ error: 'assistant_offline', ...(req.query?.debug === '1' ? { failures } : {}) })
}
