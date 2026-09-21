// The portfolio agent's "brain": matches a question to an intent, then returns
// the tool calls to display, an answer built from data.js, and the windows to open.
// It runs entirely in the browser; swap `ask` for a real model call later.
import { education, profile, skills, stats } from '../data'

const years = `${stats[0].value}+`

// On a tie the earlier intent wins, so specific topics come before broad ones.
const INTENTS = [
  {
    id: 'hello',
    keys: ['hi', 'hello', 'hey', 'yo', 'hola', 'namaste'],
    tools: [],
    answer: () =>
      "Hi, I'm Orbit, Mohit's AI agent. Ask me anything about his work, or pick a suggestion below.",
    open: [],
  },
  {
    id: 'ai',
    keys: ['ai', 'agent', 'agentic', 'mcp', 'llm', 'orchestration', 'gpt', 'claude', 'model'],
    tools: [['skills.search', '{ query: "agentic ai" }']],
    answer: () =>
      "Mohit builds MCP tools and orchestration that let AI agents work with real product features and data. His team's agentic UI application won People's Favourite at Esko Innovation Days. (I'm a small nod to that work.)",
    open: ['skills'],
  },
  {
    id: 'security',
    keys: ['security', 'veracode', 'sast', 'sca', 'vulnerability', 'vulnerabilities', 'secure', 'spoc', 'cve'],
    tools: [['security.report', '{ product: "current" }']],
    answer: () =>
      'Mohit is the security point of contact for his product on Veracode. He has resolved 100+ vulnerabilities found by SAST and SCA scans, including every high-severity finding, and received a GEM Award for it.',
    open: ['experience'],
  },
  {
    id: 'agile',
    keys: ['scrum', 'agile', 'sprint', 'delivery', 'release', 'uat', 'manager', 'management', 'backlog', 'lead', 'leadership'],
    tools: [['experience.search', '{ query: "delivery" }']],
    answer: () =>
      'As Scrum Master, Mohit runs sprint planning, backlog grooming, release planning, UAT coordination, and risk and issue tracking. As a trainee, he was handpicked for the pilot team that moved Esko R&D to weekly releases.',
    open: ['experience'],
  },
  {
    id: 'frontend',
    keys: ['react', 'frontend', 'front-end', 'ui', 'javascript', 'design', 'component', 'components', 'vite', 'webpack', 'performance'],
    tools: [['skills.search', '{ query: "frontend" }']],
    answer: () =>
      'React is his core. He built 20+ reusable Material UI components that became the standard for the Esko design system, refactored critical screens to be 20% faster with 50% fewer API calls, and led the migration from Webpack to Vite.',
    open: ['skills'],
  },
  {
    id: 'experience',
    keys: ['experience', 'job', 'work', 'career', 'esko', 'company', 'role', 'history', 'intern', 'trainee'],
    tools: [['experience.list', '{ company: "Esko" }']],
    answer: () =>
      `Mohit has been at Esko since February 2024. He started as an intern, became a trainee and is now a Software Engineer I. Highlights: MCP tools for agentic AI, Veracode security SPOC, the Webpack to Vite migration, 20+ design-system components and ~300 tests.`,
    open: ['experience'],
  },
  {
    id: 'projects',
    keys: ['project', 'projects', 'built', 'build', 'portfolio', 'github', 'vision', 'detection', 'autism', 'face', 'attendance'],
    tools: [['projects.list', '{}']],
    answer: () =>
      'Three projects from college: Vehicle Traffic & Object Detection (computer vision with a live dashboard), Autism Spectrum Disorder Detection (machine learning with ensemble methods) and a Face Recognition Smart Attendance app.',
    open: ['projects'],
  },
  {
    id: 'awards',
    keys: ['award', 'awards', 'recognition', 'hackathon', 'sih', 'achievement', 'achievements', 'potb', 'gem', 'prize', 'won'],
    tools: [['awards.list', '{}']],
    answer: () =>
      "In college he won a problem statement at the Smart India Hackathon. At Esko he has received two Pat On The Back awards, the GEM Award, People's Favourite at Innovation Days and the Mountain Mover Award.",
    open: ['awards'],
  },
  {
    id: 'skills',
    keys: ['skill', 'skills', 'stack', 'tech', 'technologies', 'tools', 'languages', 'know'],
    tools: [['skills.list', '{}']],
    answer: () => `His toolkit includes ${skills.slice(0, 12).join(', ')} and more.`,
    open: ['skills'],
  },
  {
    id: 'education',
    keys: ['education', 'college', 'degree', 'cgpa', 'study', 'studied', 'university', 'school'],
    tools: [['education.get', '{}']],
    answer: () =>
      `${education.degree} from ${education.school} (2020 to 2024), with a ${education.score}. He also led the campus FOSS Club.`,
    open: ['life'],
  },
  {
    id: 'life',
    keys: ['hobby', 'hobbies', 'interest', 'interests', 'foss', 'volunteer', 'community', 'fun', 'free', 'photography', 'mentor'],
    tools: [['life.get', '{}']],
    answer: () =>
      'Outside work, Mohit volunteers with World Vision mentoring children. In college he led the FOSS Club: 5+ events, 2 hackathons, mock interviews and mentoring. He enjoys photography, travelling, video editing and sketching.',
    open: ['life'],
  },
  {
    id: 'contact',
    keys: ['contact', 'email', 'mail', 'reach', 'linkedin', 'talk', 'connect', 'call', 'message'],
    tools: [['contact.get', '{}']],
    answer: () => `You can email him at ${profile.email}. He is also on GitHub, LinkedIn and LeetCode.`,
    open: ['contact'],
  },
  {
    id: 'resume',
    keys: ['resume', 'cv', 'pdf'],
    tools: [['files.open', '{ path: "Resume.pdf" }']],
    answer: () => 'Opening his resume now.',
    open: ['resume'],
  },
  {
    id: 'hire',
    keys: ['hire', 'fit', 'why', 'should', 'strength', 'recruit', 'best', 'good', 'value', 'candidate'],
    tools: [
      ['profile.summary', '{}'],
      ['experience.list', '{ company: "Esko" }'],
      ['awards.list', '{}'],
    ],
    answer: () =>
      `Short version: he ships. ${years} years at Esko across frontend, agentic AI, security and delivery. He resolved 100+ security vulnerabilities, wrote ~300 tests on a framework he set up, and has won six awards, including the Smart India Hackathon. Want his email?`,
    open: ['about', 'contact'],
  },
  {
    id: 'about',
    keys: ['who', 'about', 'mohit', 'yourself', 'introduce', 'summary', 'bio'],
    tools: [['profile.summary', '{}']],
    answer: () =>
      'Mohit is a Software Engineer at Esko in Bengaluru. He builds React interfaces and agentic AI tools with MCP, is the security point of contact for his product, and runs his team\'s sprints as Scrum Master.',
    open: ['about'],
  },
]

const FALLBACK = {
  id: 'fallback',
  tools: [],
  answer: () =>
    "I don't have a tool for that yet. Try asking about his experience, agentic AI work, security, projects, awards or how to contact him.",
  open: [],
}

export const suggestions = [
  'Why should I hire Mohit?',
  'What has he done with agentic AI?',
  'Tell me about his security work',
  'Show me his projects',
]

export function ask(question) {
  const words = question.toLowerCase().match(/[a-z0-9+#-]+/g) || []
  let best = FALLBACK
  let bestScore = 0
  for (const intent of INTENTS) {
    const score = intent.keys.reduce((n, k) => n + (words.includes(k) ? 1 : 0), 0)
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }
  return { id: best.id, tools: best.tools, text: best.answer(), open: best.open }
}
