// All site content lives here — edit this file to update the portfolio.

const CAREER_START = new Date(2024, 1, 1) // Feb 2024, first day at Esko

function yearsSince(date) {
  const now = new Date()
  const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())
  return Math.max(0.5, Math.floor(months / 6) / 2) // rounded down to the nearest half year
}

export const profile = {
  name: 'Mohit M B',
  role: 'Full-Stack Software Engineer',
  company: 'Esko',
  location: 'Bengaluru, India',
  email: 'mohitmb.dev@gmail.com',
  resume: '/Mohit_MB_Resume.pdf',
  photo: { src: '/mohit.jpg', small: '/mohit-sm.jpg', alt: 'Portrait of Mohit M B' },
  // Rotates in the hero: "I build ___."
  building: ['multi-agent AI systems', 'design systems in React', 'secure Spring Boot APIs', 'releases that ship'],
  links: [
    { label: 'GitHub', href: 'https://github.com/mohit833' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohitmb' },
    { label: 'LeetCode', href: 'https://leetcode.com/Mohit_MB' },
  ],
}

export const about = {
  statement:
    'I build the systems behind the product: agents that do real work, interfaces teams reuse, and APIs that stay fast and secure.',
  body: [
    'I work in the Esko R&D team in Bengaluru. I build MCP tools in Python for a multi-agent AI system, Spring Boot APIs for customer onboarding, and the React components behind the Esko design system. I am also the security point of contact for our product and the Scrum Master for my team.',
    'I joined as an intern, became a trainee and am now a Software Engineer I. Before Esko I studied Computer Science at Sri Ramakrishna Engineering College, where I built computer-vision and machine-learning prototypes and led the campus FOSS Club.',
  ],
}

export const stats = [
  { value: yearsSince(CAREER_START), decimals: 1, suffix: '+', label: 'Years shipping production code at Esko' },
  { value: 20, suffix: '+', label: 'Reusable React components in the Esko design system' },
  { value: 100, suffix: '+', label: 'Security findings resolved from SAST & SCA scans' },
  { value: 200, suffix: '+', label: 'Unit & integration tests across backend and frontend' },
  { value: 25, suffix: '+', label: 'End-to-end UI journeys automated with Selenium' },
  { value: 50, suffix: '%', label: 'Fewer API calls after refactoring critical components' },
]

export const skills = [
  'JavaScript ES6+', 'TypeScript', 'React', 'Material UI', 'Java', 'Spring Boot', 'REST APIs',
  'Python', 'MCP', 'LangGraph', 'LangChain', 'CrewAI', 'Veracode', 'SAST & SCA',
  'JUnit', 'Mockito', 'Jest', 'Selenium', 'SQL', 'Docker', 'Git', 'Jira', 'Confluence',
  'OpenSearch', 'Agile', 'Scrum',
]

// The multi-agent system, drawn live in the Systems section.
export const agentFlow = {
  request: { label: 'Platform request', note: 'Something a person or a service asks the platform to do.' },
  orchestrator: {
    label: 'Orchestrator agent',
    note: 'Reads the request, plans the work and delegates each part to the right specialist.',
  },
  agents: [
    { label: 'Specialised agent', note: 'Owns one domain of the platform and decides which tools to call.' },
    { label: 'Specialised agent', note: 'Works in parallel with the others, each with its own tools.' },
    { label: 'Specialised agent', note: 'Reports its result back to the orchestrator.' },
  ],
  tools: {
    label: 'MCP tools · Python',
    note: 'What I build: typed, permissioned entry points that let an agent act on the platform.',
  },
  platform: { label: 'Platform operations', note: 'The real systems the agents act on, through those tools.' },
}

export const expertise = [
  {
    title: 'Agentic AI Systems',
    body: 'MCP tools in Python for a multi-agent system, where specialised agents coordinated by an orchestrator carry out platform operations.',
    tags: ['MCP', 'Python', 'LangGraph', 'LangChain', 'CrewAI'],
  },
  {
    title: 'Full-Stack Product Engineering',
    body: 'React and Material UI components that became the Esko design-system standard, and Spring Boot REST APIs for customer onboarding, subscriptions and other microservices.',
    tags: ['React', 'TypeScript', 'Spring Boot', 'REST APIs'],
  },
  {
    title: 'Application Security',
    body: 'Security point of contact for the product on Veracode. I have resolved 100+ findings from SAST and SCA scans, including every high-severity one.',
    tags: ['Veracode', 'SAST', 'SCA'],
  },
  {
    title: 'Quality & Delivery',
    body: 'Tests at every level and a team that ships: 200+ unit and integration tests, 25+ Selenium journeys, and sprints I run as Scrum Master.',
    tags: ['JUnit', 'Mockito', 'Jest', 'Selenium', 'Scrum'],
  },
]

export const experience = [
  {
    role: 'Software Engineer I',
    company: 'Esko',
    period: 'Aug 2025 — Present',
    location: 'Bengaluru, India',
    points: [
      'Built MCP tools in Python for a multi-agent AI system, so specialised agents coordinated by an orchestrator agent can carry out platform operations.',
      'Implemented Spring Boot REST APIs for customer onboarding and subscriptions, integrated with the internal IAM service, so pre-sales teams can onboard customers and provision site-level subscriptions.',
      'Developed 20+ reusable React components with unit tests, setting the standard for the Esko design system.',
      'Strengthened product security with Veracode, resolving 100+ findings from SAST and SCA scans.',
      'Automated 25+ end-to-end UI tests with Selenium and Java, cutting manual regression testing.',
      'Owned sprint planning and backlog grooming as Scrum Master, managed product translations and drove cross-functional collaboration.',
      'Led a team of 5 at Esko Innovation Days, delivering 7 new features that increased customer satisfaction.',
    ],
    tags: ['MCP', 'Python', 'Spring Boot', 'React', 'Veracode', 'Scrum'],
  },
  {
    role: 'Software Engineer Trainee',
    company: 'Esko',
    period: 'Aug 2024 — Jul 2025',
    location: 'Bengaluru, India',
    points: [
      'Handpicked for a pilot project on continuous improvement through weekly releases, which established a new way of working in the Esko R&D department.',
      'Refactored critical components to boost performance and cut API calls by 50%, improving app speed and running cost.',
      'Developed public APIs for core platform features so other microservices could consume them.',
      'Contributed to the gradual migration of a legacy Marionette.js application to React, modernising the stack with minimal disruption.',
    ],
    tags: ['React', 'Java', 'Spring Boot', 'Performance'],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Esko',
    period: 'Feb 2024 — Jul 2024',
    location: 'Bengaluru, India',
    points: [
      'Authored and maintained 200+ unit and integration tests across the backend (JUnit, Mockito) and the frontend (Jest), improving reliability and coverage.',
    ],
    tags: ['JUnit', 'Mockito', 'Jest'],
  },
]

// Proof panels: every number on this site has a picture to go with it.
export const impact = [
  {
    kind: 'security',
    value: '100+',
    title: 'Security findings, resolved',
    body: 'As security point of contact I work through Veracode SAST and SCA results until the board is clear, including every high-severity finding.',
    foot: 'Veracode · SAST · SCA',
  },
  {
    kind: 'tests',
    value: '225+',
    title: 'Tests that run without me',
    body: '200+ unit and integration tests across backend and frontend, plus 25+ Selenium journeys that replaced manual regression passes.',
    foot: 'JUnit · Mockito · Jest · Selenium',
  },
  {
    kind: 'api',
    value: '50%',
    title: 'Fewer API calls',
    body: 'Refactoring critical components halved the calls they made, which made the app faster for users and cheaper to run.',
    foot: 'React · performance',
  },
]

export const work = [
  {
    title: 'Multi-Agent AI Tooling',
    kind: 'Esko · Python, MCP',
    visual: 'agents',
    description:
      'MCP tools that give AI agents safe, typed access to platform operations. An orchestrator agent plans the work and delegates it to specialised agents, which call the tools I build.',
    tags: ['MCP', 'Python', 'Multi-agent', 'Orchestration'],
  },
  {
    title: 'Onboarding & Subscriptions',
    kind: 'Esko · Spring Boot, IAM',
    visual: 'api',
    description:
      'REST APIs for the customer onboarding and subscription flow, integrated with the internal IAM service, so pre-sales teams can onboard a customer and provision site-level subscriptions themselves.',
    tags: ['Spring Boot', 'REST APIs', 'IAM', 'Java'],
  },
  {
    title: 'The Esko Design System',
    kind: 'Esko · React, Material UI',
    visual: 'design',
    description:
      '20+ reusable, modular React components with unit tests, which set the standard other teams now build on. Refactors along the way halved the API calls in critical screens.',
    tags: ['React', 'Material UI', 'Jest', 'Design Systems'],
  },
  {
    title: 'Security & Test Automation',
    kind: 'Esko · Veracode, Selenium',
    visual: 'shield',
    description:
      'Security point of contact on Veracode, resolving 100+ SAST and SCA findings, plus 25+ automated Selenium journeys that keep regressions out of weekly releases.',
    tags: ['Veracode', 'SAST', 'SCA', 'Selenium'],
  },
]

export const projects = [
  {
    title: 'Vehicle Traffic & Object Detection',
    kind: 'Computer Vision · Web Dashboard',
    visual: 'traffic',
    description:
      'A real-time detection system that monitors traffic and identifies objects in a chosen area, tracking them as they move and drawing their paths on an interactive dashboard.',
    tags: ['Computer Vision', 'Object Tracking', 'React'],
  },
  {
    title: 'Autism Spectrum Disorder Detection',
    kind: 'Machine Learning · Healthcare',
    visual: 'ml',
    description:
      'A machine-learning system that finds the most significant diagnostic traits for ASD. Ensemble methods gave the best accuracy for early diagnosis.',
    tags: ['Python', 'Classification', 'Ensemble Methods'],
  },
  {
    title: 'Face Recognition Smart Attendance',
    kind: 'AI · Mobile',
    visual: 'face',
    description:
      'A contact-free attendance system that recognises faces and logs attendance in a mobile app, built to keep reliable records for rural development workers.',
    tags: ['Face Recognition', 'Mobile App', 'Biometrics'],
  },
]

export const recognition = [
  {
    title: 'Smart India Hackathon',
    detail: 'Problem Statement Winner',
    org: 'AICTE, Govt. of India · College',
    featured: true,
  },
  {
    title: 'Pat On The Back',
    badge: '×2',
    points: [
      'For setting up the unit-testing framework and writing around 300 test cases in my first months at Esko.',
      'For taking ownership of product translations and the collaboration between components and connectors.',
    ],
    org: 'Esko',
  },
  {
    title: 'GEM Award',
    points: [
      'For taking on Veracode and resolving every high-severity vulnerability.',
      'For leading the migration from Webpack to Vite.',
    ],
    org: 'Esko',
  },
  {
    title: "People's Favourite",
    detail: 'Finalist at Esko Innovation Days. Won for building an agentic UI application.',
    org: 'Esko Innovation Days',
  },
  {
    title: 'Mountain Mover Award',
    points: [
      'For the migration of a legacy Marionette.js application to React.',
      'For designing a reusable component shared across multiple microservices.',
    ],
    org: 'Esko · Nov 2024',
  },
]

export const beyond = [
  {
    title: 'FOSS Club Lead',
    period: '2022 — 2024',
    points: [
      'Organised 5+ virtual and in-person events for 100+ students from CS and non-CS branches, showing them practical uses of AI and generative tools.',
      'Ran 2 in-person hackathons with 30+ participants.',
      'Conducted mock interviews for students at our college.',
      'Mentored 5 students through their projects.',
    ],
  },
  {
    title: 'World Vision Volunteer',
    period: '2023 — Present',
    points: [
      'Mentor and support underprivileged children.',
      'Help organise educational workshops and community awareness sessions.',
    ],
  },
]

export const education = {
  degree: 'B.E. Computer Science & Engineering',
  school: 'Sri Ramakrishna Engineering College',
  period: '2020 — 2024 · Coimbatore',
  score: 'CGPA 8.72',
}

export const interests = ['Photography', 'Travelling', 'Video Editing', 'Sketching']
export const languages = ['English', 'Malayalam', 'Tamil', 'Hindi']
