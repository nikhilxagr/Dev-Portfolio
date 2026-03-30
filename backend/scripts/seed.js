import { connectDatabase, disconnectDatabase } from '../src/config/db.js'
import Project from '../src/models/Project.js'
import Blog from '../src/models/Blog.js'

const projects = [
  {
    title: 'Secure Notes Platform',
    description:
      'A full stack encrypted notes platform with JWT auth, role checks, and audit-focused security middleware.',
    category: 'Web Dev',
    techStack: ['React', 'Tailwind', 'Node.js', 'Express', 'MongoDB'],
    githubUrl: 'https://github.com/nikhilxagr/secure-notes',
    liveDemoUrl: 'https://secure-notes-demo.vercel.app',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
    problemStatement:
      'Users needed a simple note manager but sensitive data could not be stored in plain text.',
    solutionSummary:
      'Implemented encryption-at-rest for note payloads, JWT-based auth, and strict validation for all API endpoints.',
    featured: true,
    status: 'published',
  },
  {
    title: 'Threat Surface Mapper',
    description:
      'A cyber utility dashboard to automate recon workflow summaries and security posture reports.',
    category: 'Cyber Security',
    techStack: ['Node.js', 'Express', 'MongoDB', 'Linux'],
    githubUrl: 'https://github.com/nikhilxagr/threat-surface-mapper',
    liveDemoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1200',
    problemStatement:
      'Recon outputs from multiple tools were fragmented and hard to compare across scans.',
    solutionSummary:
      'Built a normalized parser workflow that aggregates findings into a single dashboard with trend views.',
    featured: true,
    status: 'published',
  },
  {
    title: 'AI Study Planner Assistant',
    description:
      'An AI-supported scheduling tool that suggests dynamic weekly study plans from workload and deadlines.',
    category: 'AI',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
    githubUrl: 'https://github.com/nikhilxagr/ai-study-planner',
    liveDemoUrl: 'https://ai-study-planner.vercel.app',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
    problemStatement:
      'Students struggle to maintain realistic schedules when coursework and deadlines keep changing.',
    solutionSummary:
      'Created adaptive plan generation logic that recalculates priorities based on upcoming deadlines and progress.',
    featured: true,
    status: 'published',
  },
]

const blogs = [
  {
    title: 'How I Secure Express APIs as a Student Developer',
    excerpt: 'A practical checklist for JWT auth, validation, and abuse controls.',
    content:
      'Security starts with predictable input handling. In this post, I cover validator-first route design, JWT claim validation, strict CORS, and request throttling. I also explain how to make errors safe for users while still useful for debugging.',
    tags: ['security', 'express', 'jwt'],
    imageUrl: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1200',
    status: 'published',
  },
  {
    title: 'Building a Recruiter-Friendly Developer Portfolio',
    excerpt: 'Design decisions that communicate engineering credibility in seconds.',
    content:
      'A portfolio should quickly communicate what you build, how you think, and why your work is trustworthy. I discuss structure, visual hierarchy, technical storytelling, and measurable project outcomes.',
    tags: ['portfolio', 'frontend', 'career'],
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200',
    status: 'published',
  },
  {
    title: 'TryHackMe Lessons I Applied to Real Projects',
    excerpt: 'Turning lab knowledge into practical development habits.',
    content:
      'Labs are useful when they change your engineering habits. This article covers authentication hardening, security headers, access control checks, and common vulnerabilities that I now prevent in every project.',
    tags: ['tryhackme', 'cybersecurity', 'web'],
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200',
    status: 'published',
  },
]

const seed = async () => {
  await connectDatabase()

  await Project.deleteMany({})
  await Blog.deleteMany({})

  await Project.insertMany(projects)
  await Blog.insertMany(blogs)

  console.log('Seed completed: projects and blogs inserted.')
  await disconnectDatabase()
}

seed().catch(async (error) => {
  console.error('Seed failed:', error)
  await disconnectDatabase()
  process.exit(1)
})
