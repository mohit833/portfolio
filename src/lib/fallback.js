// Used when the assistant API is unavailable, so the panel still answers
// instead of showing an error. Keyword matching, no model.
import { education, profile, skills, stats } from '../data'

const INTENTS = [
  {
    keys: ['hi', 'hello', 'hey'],
    text: "Hi! Ask me anything about Mohit's work.",
    section: null,
  },
  {
    keys: ['ai', 'agent', 'agentic', 'mcp', 'llm', 'orchestration', 'python'],
    text: 'Mohit builds MCP tools in Python for a multi-agent AI system at Esko, where specialised agents coordinated by an orchestrator carry out platform operations.',
    section: 'skills',
  },
  {
    keys: ['api', 'apis', 'backend', 'spring', 'boot', 'java', 'iam', 'onboarding', 'subscription'],
    text: 'He writes Spring Boot REST APIs, including the onboarding and subscription flow that lets pre-sales teams onboard customers from a single form instead of a stack of Swagger calls.',
    section: 'case-study',
  },
  {
    keys: ['security', 'veracode', 'sast', 'sca', 'vulnerability', 'vulnerabilities', 'secure'],
    text: 'He is the security point of contact for his product on Veracode and has resolved 100+ findings from SAST and SCA scans, including every high-severity one.',
    section: 'impact',
  },
  {
    keys: ['react', 'frontend', 'ui', 'component', 'components', 'design', 'javascript', 'typescript'],
    text: 'React is his core: 20+ reusable Material UI components that became the Esko design-system standard, and refactors that halved the API calls on critical screens.',
    section: 'work',
  },
  {
    keys: ['test', 'tests', 'testing', 'selenium', 'jest', 'junit', 'mockito', 'quality'],
    text: 'He has written 200+ unit and integration tests across backend and frontend, plus 25+ Selenium journeys that replaced manual regression passes.',
    section: 'impact',
  },
  {
    keys: ['experience', 'job', 'work', 'career', 'esko', 'role', 'history'],
    text: 'Mohit has been at Esko since February 2024: intern, then trainee, now Software Engineer I.',
    section: 'experience',
  },
  {
    keys: ['award', 'awards', 'hackathon', 'recognition', 'achievement', 'won'],
    text: "In college he won a problem statement at the Smart India Hackathon. At Esko he has two Pat On The Back awards, the GEM Award, People's Favourite at Innovation Days and the Mountain Mover Award.",
    section: 'recognition',
  },
  {
    keys: ['education', 'college', 'degree', 'cgpa', 'study', 'studied'],
    text: `${education.degree} from ${education.school}, ${education.period}, with a ${education.score}.`,
    section: 'beyond',
  },
  {
    keys: ['contact', 'email', 'reach', 'hire', 'talk', 'connect'],
    text: `You can email him at ${profile.email}, or find him on GitHub and LinkedIn.`,
    section: 'contact',
  },
  {
    keys: [
      'skill', 'skills', 'skillset', 'skillsets', 'stack', 'techstack', 'tech', 'tools', 'toolkit',
      'languages', 'language', 'framework', 'frameworks', 'technologies', 'know', 'knows',
    ],
    text: `His stack: ${skills.join(', ')}.`,
    section: 'skills',
  },
  {
    keys: ['who', 'about', 'mohit', 'summary', 'introduce'],
    text: `Mohit is a ${profile.role} at ${profile.company} in ${profile.location}, with ${stats[0].value}+ years of production experience.`,
    section: 'about',
  },
]

export const SUGGESTIONS = [
  'What has he built with AI agents?',
  'Tell me about his backend work',
  'Is he strong on security?',
  'How do I get in touch?',
]

export function fallbackAnswer(question) {
  const words = question.toLowerCase().match(/[a-z0-9+#-]+/g) || []
  let best = null
  let score = 0
  for (const intent of INTENTS) {
    const hits = intent.keys.reduce((n, k) => n + (words.includes(k) ? 1 : 0), 0)
    if (hits > score) {
      best = intent
      score = hits
    }
  }
  if (!best) {
    return {
      text: `I can cover his experience, the AI and backend work, security, projects and how to reach him. For anything else, email ${profile.email}.`,
      section: null,
    }
  }
  return { text: best.text, section: best.section }
}
