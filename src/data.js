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
  tagline:
    'I build fast, reusable React interfaces and write the tests that keep them reliable.',
  links: [
    { label: 'GitHub', href: 'https://github.com/mohit833' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/m0h1t-mb/' },
    { label: 'LeetCode', href: 'https://leetcode.com/Mohit_MB' },
  ],
}

export const about = {
  statement:
    'I turn complex product requirements into clean, reusable interfaces that scale, and I write the tests that keep them working.',
  body: [
    'I work in the Esko R&D team in Bengaluru, where I build the React components behind the Esko design system, speed up critical screens and help run our sprints. I joined as an intern, became a trainee and am now a Software Engineer.',
    'Before that I studied Computer Science at Sri Ramakrishna Engineering College. There I built computer-vision and machine-learning prototypes and led the campus FOSS Club.',
  ],
}

export const stats = [
  { value: yearsSince(CAREER_START), decimals: 1, suffix: '+', label: 'Years shipping production code at Esko' },
  { value: 20, suffix: '+', label: 'Reusable React components in the Esko design system' },
  { value: 200, suffix: '+', label: 'Unit & integration tests written for backend APIs' },
  { value: 50, suffix: '%', label: 'Fewer API calls after refactoring critical components' },
  { value: 20, suffix: '%', label: 'Performance boost on the refactored components' },
  { value: 8.72, decimals: 2, label: 'CGPA, B.E. Computer Science & Engineering' },
]

export const skills = [
  'React', 'JavaScript ES6+', 'Material UI', 'Java', 'Spring Boot', 'REST APIs',
  'Jest', 'Mockito', 'Docker', 'Elasticsearch', 'OpenSearch', 'Kibana',
  'MySQL', 'SQL', 'HTML & CSS', 'Git', 'Jira', 'Figma', 'Maven', 'Scrum',
]

export const experience = [
  {
    role: 'Software Engineer I',
    company: 'Esko',
    period: 'Aug 2025 — Present',
    location: 'Bengaluru, India',
    points: [
      'Designed 20+ reusable, modular React components with unit tests. They became the standard for the Esko design system.',
      'Refactored critical components, improving performance by 20% and cutting API calls by 50%, which made the app faster and cheaper to run.',
      'Took ownership of sprint planning and backlog grooming, keeping the workflow steady, priorities clear and cross-functional teams in sync.',
      'Led a team of 5 in the Esko Innovation Days contest. The team shipped 7 new features that raised customer satisfaction by 15%.',
    ],
    tags: ['React', 'Material UI', 'Jest', 'Design Systems', 'Scrum'],
  },
  {
    role: 'Software Engineer Trainee',
    company: 'Esko',
    period: 'Aug 2024 — Jul 2025',
    location: 'Bengaluru, India',
    points: [
      'Handpicked for a small pilot team that moved to weekly releases. It set a new way of working for the Esko R&D department.',
      'Wrote and maintained 200+ unit and integration tests for backend APIs using Mockito, improving reliability and test coverage.',
    ],
    tags: ['Java', 'Spring Boot', 'Mockito', 'REST APIs'],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Esko',
    period: 'Feb 2024 — Jul 2024',
    location: 'Bengaluru, India',
    points: [
      'Helped migrate a legacy Marionette/Backbone.js application to React step by step, modernizing the stack with minimal disruption.',
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
      'An AI-powered, contact-free attendance system that recognizes faces and securely logs attendance in a mobile app. It also uses retinal analysis to track daily attendance for rural development workers and keep reliable records for daily-wage earners.',
    tags: ['Face Recognition', 'Mobile App', 'Biometrics', 'Social Impact'],
  },
]

export const recognition = [
  {
    title: 'Smart India Hackathon',
    detail: 'Problem Statement Winner',
    org: 'AICTE, Govt. of India',
    featured: true,
  },
  {
    title: 'POTB Award',
    detail: 'Pat On The Back, for delivering outstanding results',
    org: 'Esko · Dec 2024',
  },
  {
    title: 'Mountain Mover Award',
    detail: 'For outstanding collaboration and impact as part of a high-performing team',
    org: 'Esko · Nov 2024',
  },
  {
    title: 'Innovation Days',
    detail: 'Led a team of 5 that shipped 7 new features',
    org: 'Esko',
  },
]

export const certifications = [
  { title: 'Full-Stack Development', org: 'Cispro Training Institute' },
  { title: 'Artificial Intelligence: Foundation', org: 'Wipro' },
  { title: 'Introduction to Industry 4.0', org: 'NPTEL' },
]

export const beyond = [
  {
    title: 'FOSS Club Lead',
    period: '2022 — 2024',
    points: [
      'Organized 5+ virtual and in-person events for 100+ students from CS and non-CS branches, showing them practical uses of AI and generative tools.',
      'Ran 2 in-person hackathons with 30+ participants.',
      'Mentored student teams through to two finished projects.',
    ],
  },
  {
    title: 'World Vision Volunteer',
    period: '2023 — Present',
    points: [
      'Mentor and support underprivileged children.',
      'Help organize educational workshops and community awareness sessions.',
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
