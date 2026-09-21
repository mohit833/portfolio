// All site content lives here — edit this file to update the portfolio.

const CAREER_START = new Date(2024, 1, 1) // Feb 2024, first day at Esko

function yearsSince(date) {
  const now = new Date()
  const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())
  return Math.max(0.5, Math.floor(months / 6) / 2) // rounded down to the nearest half year
}

export const profile = {
  name: 'Mohit M B',
  role: 'Software Engineer',
  company: 'Esko',
  location: 'Bengaluru, India',
  email: 'm0h1tmb.official@gmail.com',
  resume: '/Mohit_MB_Resume.pdf',
  photo: { src: '/mohit.jpg', small: '/mohit-sm.jpg', alt: 'Portrait of Mohit M B' },
  // Rotates in the hero: "I build ___."
  building: ['React interfaces', 'agentic AI tools', 'secure software', 'teams that ship'],
  links: [
    { label: 'GitHub', href: 'https://github.com/mohit833' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/m0h1t-mb/' },
    { label: 'LeetCode', href: 'https://leetcode.com/Mohit_MB' },
  ],
}

export const about = {
  statement:
    'I build interfaces people enjoy using, AI tools that do real work, and releases that ship secure and on time.',
  body: [
    'I work in the Esko R&D team in Bengaluru. I build the React components behind the Esko design system and agentic AI tools with MCP. I am also the security point of contact for our product and the Scrum Master for my team. I joined as an intern, became a trainee and am now a Software Engineer.',
    'Before that I studied Computer Science at Sri Ramakrishna Engineering College. There I built computer-vision and machine-learning prototypes and led the campus FOSS Club.',
  ],
}

export const stats = [
  { value: yearsSince(CAREER_START), decimals: 1, suffix: '+', label: 'Years shipping production code at Esko' },
  { value: 20, suffix: '+', label: 'Reusable React components in the Esko design system' },
  { value: 300, prefix: '~', label: 'Test cases written after I set up our unit-testing framework' },
  { value: 100, suffix: '+', label: 'Security vulnerabilities resolved from SAST & SCA scans' },
  { value: 50, suffix: '%', label: 'Fewer API calls after refactoring critical components' },
  { value: 20, suffix: '%', label: 'Performance boost on the refactored components' },
]

export const skills = [
  'React', 'JavaScript ES6+', 'Material UI', 'MCP', 'Agentic AI', 'AI Orchestration',
  'Vite', 'Webpack', 'Java', 'Spring Boot', 'REST APIs', 'Veracode', 'SAST & SCA', 'Jest', 'Mockito',
  'Docker', 'Elasticsearch', 'OpenSearch', 'Kibana', 'MySQL', 'Git', 'Jira', 'Figma',
  'Scrum', 'Release Planning', 'UAT',
]

export const expertise = [
  {
    title: 'Frontend & Design Systems',
    body: 'Reusable React and Material UI components, covered by unit tests, that set the standard for the Esko design system. I also refactor critical screens to make them faster, and I led our move from Webpack to Vite.',
    tags: ['React', 'Material UI', 'Vite', 'Jest', 'Performance'],
  },
  {
    title: 'Agentic AI',
    body: "MCP tools and orchestration that let AI agents work with real product features and data. The agentic UI application my team built won People's Favourite at Esko Innovation Days.",
    tags: ['MCP', 'Orchestration', 'AI Agents', 'Agentic UI'],
  },
  {
    title: 'Application Security',
    body: 'Security point of contact (SPOC) for the product on Veracode. I have resolved 100+ vulnerabilities found by SAST and SCA analysis, including every high-severity finding.',
    tags: ['Veracode', 'SAST', 'SCA'],
  },
  {
    title: 'Agile & Delivery',
    body: 'As Scrum Master for my team, I run sprint planning, backlog grooming, release planning, UAT coordination, and risk and issue tracking.',
    tags: ['Scrum', 'Release Planning', 'UAT', 'Jira'],
  },
]

export const experience = [
  {
    role: 'Software Engineer I',
    company: 'Esko',
    period: 'Aug 2025 — Present',
    location: 'Bengaluru, India',
    points: [
      'Built MCP tools and orchestration for agentic AI features in Esko products.',
      'As security SPOC for the product on Veracode, resolved 100+ vulnerabilities found by SAST and SCA analysis, including every high-severity finding.',
      'Led the migration of our build from Webpack to Vite.',
      'Designed 20+ reusable, modular React components with unit tests. They became the standard for the Esko design system.',
      'Refactored critical components, improving performance by 20% and cutting API calls by 50%, which made the app faster and cheaper to run.',
      'Took ownership of product translations and of cross-team collaboration on product connectors and integrations.',
      'As Scrum Master, ran sprint planning, backlog grooming, release planning, UAT coordination, and risk and issue tracking.',
      "Led a team of 5 to the Esko Innovation Days finals, winning People's Favourite for an agentic UI application. The team built 7 new features that raised customer satisfaction by 15%.",
    ],
    tags: ['React', 'MCP', 'Agentic AI', 'Veracode', 'Scrum'],
  },
  {
    role: 'Software Engineer Trainee',
    company: 'Esko',
    period: 'Aug 2024 — Jul 2025',
    location: 'Bengaluru, India',
    points: [
      'Handpicked for a small pilot team that moved to weekly releases. It set a new way of working for the Esko R&D department.',
      'Set up the unit-testing framework and wrote around 300 unit and integration tests for backend APIs with Mockito, improving reliability and test coverage.',
      'Built a shared component used across multiple microservices.',
    ],
    tags: ['Java', 'Spring Boot', 'Mockito', 'REST APIs'],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Esko',
    period: 'Feb 2024 — Jul 2024',
    location: 'Bengaluru, India',
    points: [
      'Helped migrate a legacy Marionette/Backbone.js application to React step by step, modernising the stack with minimal disruption.',
    ],
    tags: ['React', 'Backbone.js', 'Migration'],
  },
]

export const projects = [
  {
    title: 'Vehicle Traffic & Object Detection',
    kind: 'Computer Vision · Web Dashboard',
    visual: 'traffic',
    description:
      'A real-time detection system that uses computer vision to monitor traffic and identify objects in a chosen area. It tracks vehicles and other objects as they move and draws their paths on an interactive web dashboard.',
    tags: ['Computer Vision', 'Object Tracking', 'React', 'Real-time'],
  },
  {
    title: 'Autism Spectrum Disorder Detection',
    kind: 'Machine Learning · Healthcare',
    visual: 'ml',
    description:
      'A machine-learning system that finds the most significant diagnostic traits for ASD. I compared several classification algorithms, and ensemble methods gave the best accuracy for early diagnosis.',
    tags: ['Python', 'Classification', 'Ensemble Methods', 'Feature Selection'],
  },
  {
    title: 'Face Recognition Smart Attendance',
    kind: 'AI · Mobile',
    visual: 'face',
    description:
      'An AI-powered, contact-free attendance system that recognises faces and securely logs attendance in a mobile app. It also uses retinal analysis to track daily attendance for rural development workers and keep reliable records for daily-wage earners.',
    tags: ['Face Recognition', 'Mobile App', 'Biometrics', 'Social Impact'],
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
      'For migrating a legacy application from Backbone.js to React.',
      'For building a component shared across multiple microservices.',
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
