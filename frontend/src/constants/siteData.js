export const SITE_PROFILE = {
  fullName: 'Nikhil Agrahari',
  shortName: 'Nikhil',
  title: 'Nikhil Agrahari | Full Stack Developer | Cyber Security Analyst',
  headline: 'BCA Student | Full Stack Developer | Cyber Security Analyst',
  role: 'Web Developer',
  education: 'BCA, BBD University, Lucknow',
  location: 'Lucknow, India',
  availability:
    'Open to freelance projects, portfolio guidance, mentorship, and collaboration.',
  shortIntro:
    'Passionate about creating modern, user-friendly web applications and exploring the world of cybersecurity. Transforming ideas into interactive digital experiences.',
  profileImage: '/images/profile/nikhil-upload-hero.png',
  profileImageAlt: 'Portrait of Nikhil Agrahari',
}

export const HERO_CONTENT = {
  eyebrow: 'Full Stack Developer | Cyber Security Learner',
  title: 'Building modern web products and learning how to secure them.',
  description:
    'I work across frontend and backend development, build clean user-focused experiences, and document my cyber security journey through labs, writeups, and hands-on practice.',
  primaryCta: {
    label: 'View Projects',
    to: '/projects',
  },
  secondaryCta: {
    label: 'Contact Me',
    to: '/contact',
  },
}

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/security', label: 'Practicals' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/nikhilxagr' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nikhilxagr/' },
  { label: 'Medium', href: 'https://medium.com/@nikhilxagr' },
  { label: 'TryHackMe', href: 'https://tryhackme.com/p/nikhilxagr' },
  { label: 'WhatsApp', href: 'https://wa.me/7897972883' },
]

export const QUICK_CONTACT = {
  email: 'nikhilagrahari530@gmail.com',
  phone: '+91 7897972883',
  whatsapp: 'https://wa.me/7897972883',
  linkedin: 'https://www.linkedin.com/in/nikhilxagr/',
  github: 'https://github.com/nikhilxagr',
  medium: 'https://medium.com/@nikhilxagr',
  resume: 'https://drive.google.com/file/d/1-BUv73624cDLAwxRkLhZGQBkQqyJUVWG/view?usp=drive_link',
}

export const ABOUT_STORY = [
  "Hi, I'm Nikhil Agrahari.",
  'I am a second-year BCA student at BBD University, Lucknow, with a growing passion for web development, cybersecurity, and ethical hacking. Currently working as a web developer, I enjoy turning ideas into interactive, user-friendly digital solutions.',
  'I believe in writing clean, efficient code and building projects that not only work well but also create real value. Alongside development, I am deeply interested in cyber defense and ethical hacking, and I keep exploring how systems can be made safer, faster, and more reliable.',
  'My learning path stays broad on purpose. I enjoy frontend development, backend logic, and practical security work, because understanding how things are built also helps me understand how they should be protected.',
  'Beyond coding, I am focused on consistent growth, collaboration, and building work that reflects both curiosity and discipline.',
]

export const FOCUS_AREAS = [
  'Responsive frontend development',
  'Backend API development',
  'Portfolio and product building',
  'Cyber security labs and practical learning',
  'Clean UI with strong usability',
]

export const SKILL_GROUPS = [
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express.js', 'MongoDB', 'Firebase', 'MERN Stack'],
  },
  {
    title: 'Languages',
    items: ['JavaScript', 'Python', 'Java'],
  },
  {
    title: 'Database',
    items: ['MongoDB Atlas', 'Mongoose', 'Schema Design', 'Indexing'],
  },
  {
    title: 'Cybersecurity Tools',
    items: ['Kali Linux', 'Burp Suite', 'Nmap', 'Wireshark', 'Steghide'],
  },
  {
    title: 'Other Tools',
    items: ['Git', 'GitHub', 'Postman', 'Linux', 'Vercel', 'Render'],
  },
]

export const STATS_METRICS = [
  {
    id: 'leetcode',
    label: 'LeetCode Problems Solved',
    value: '102',
    detail: 'Problems solved',
    link: 'https://leetcode.com/u/nikhilxagr/',
  },
  {
    id: 'gfg',
    label: 'GFG Score',
    value: '96',
    detail: 'Problems solved',
    link: 'https://www.geeksforgeeks.org/profile/nikhilxagr?tab=activity',
  },
  {
    id: 'tryhackme',
    label: 'TryHackMe',
    value: 'Top 1%',
    detail: 'Rank 16773 | 275 completed rooms',
    link: 'https://tryhackme.com/p/nikhilxagr',
  },
  {
    id: 'github',
    label: 'GitHub Repositories',
    value: '26',
    detail: 'Public repositories',
    link: 'https://github.com/nikhilxagr',
  },
]

export const PROJECT_CATEGORIES = ['All', 'Web Dev', 'Cyber Security', 'AI']

export const SIGNATURE_PROJECTS = [
  {
    slug: 'fast-feast',
    title: 'Fast Feast',
    category: 'Web Dev',
    tagline:
      'A modern food delivery experience with a clean browsing and ordering flow.',
    description:
      'Fast Feast is a frontend-focused food delivery project built to simulate the experience of exploring menus, adding items to a cart, and following a smooth order journey.',
    problemStatement:
      'The goal was to build a user-friendly food delivery interface that felt modern, simple to navigate, and visually engaging.',
    solutionSummary:
      'The project demonstrates layout design, responsive UI structure, and clean interaction flow using core web technologies.',
    outcome:
      'Demonstrated end-to-end user flow clarity, responsive UI quality, and practical frontend implementation discipline.',
    highlights: [
      'Interactive menu browsing',
      'Cart functionality',
      'Order tracking interface',
      'Responsive frontend layout',
    ],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    githubUrl:
      'https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Food%20Delivery%20Website',
    liveDemoUrl: 'https://fastfeast-agr.netlify.app/',
    featured: true,
  },
  {
    slug: 'snapurl',
    title: 'snapURL',
    category: 'Web Dev',
    tagline: 'A MERN-based URL shortener for clean, shareable links.',
    description:
      'snapURL is a full stack URL shortener that helps users convert long URLs into compact links that are easier to share, organize, and manage.',
    problemStatement:
      'Long links are difficult to share neatly, especially across social posts, student work, and project documentation.',
    solutionSummary:
      'This project shows end-to-end application development with a React frontend, Express backend, and MongoDB-powered data flow.',
    outcome:
      'Built a full stack production-style workflow with API integration, persistence, and a practical URL utility use-case.',
    highlights: [
      'Short link generation',
      'Frontend and backend integration',
      'REST API workflow',
      'Database-backed URL management',
    ],
    techStack: [
      'React',
      'React Router DOM',
      'JavaScript',
      'Axios',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
    ],
    githubUrl: 'https://github.com/nikhilxagr/snapurl-URL-SHORTNER',
    liveDemoUrl: 'https://snapurl-url-shortner.vercel.app/',
    featured: true,
  },
  {
    slug: 'ai-powered-code-reviewer',
    title: 'AI Powered Code Reviewer',
    category: 'AI',
    tagline:
      'An AI-assisted review platform focused on code quality and developer support.',
    description:
      'AI Powered Code Reviewer is a MERN-based platform designed to analyze code, highlight issues, suggest improvements, and maintain code quality standards in a more streamlined workflow.',
    problemStatement:
      'Developers often need faster feedback on code quality, possible bugs, and maintainability without losing track of previous reviews.',
    solutionSummary:
      'This project reflects interest in AI-assisted developer tooling, secure access control, and building feature-rich full stack platforms.',
    outcome:
      'Showcased AI-assisted developer workflow design with strong focus on productivity and secure collaboration paths.',
    highlights: [
      'AI-based code review flow',
      'Security scanning direction',
      'Authentication and user management',
      'Review history tracking',
    ],
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js'],
    githubUrl:
      'https://github.com/nikhilxagr/AI-Powered-Code-Reviewer-MERN-Project',
    liveDemoUrl: '',
    featured: true,
  },
]

export const PRACTICALS = [
  {
    slug: 'kali-linux-setup',
    title: 'Kali Linux Setup',
    summary:
      'Configured a Kali Linux environment for practical learning in networking, reconnaissance, and web security workflows.',
    focus: 'Environment setup and tool familiarity',
    tools: ['Kali Linux', 'Linux CLI'],
    level: 'Beginner',
    status: 'ready',
    writeupStatus: 'summary-ready',
  },
  {
    slug: 'nmap-scanning-lab',
    title: 'Nmap Scanning Lab',
    summary:
      'Practiced host discovery, service enumeration, and structured scanning techniques in a controlled environment.',
    focus: 'Reconnaissance and network visibility',
    tools: ['Nmap', 'Linux'],
    level: 'Beginner',
    status: 'ready',
    writeupStatus: 'summary-ready',
  },
  {
    slug: 'tryhackme-rooms',
    title: 'TryHackMe Room Practice',
    summary:
      'Working through guided rooms to strengthen fundamentals in networking, web security, privilege escalation, and practical attack-defense thinking.',
    focus: 'Guided cyber security learning',
    tools: ['TryHackMe', 'Linux', 'Burp Suite', 'Nmap'],
    level: 'Beginner to Intermediate',
    status: 'ongoing',
    writeupStatus: 'add-room-wise-later',
  },
  {
    slug: 'burp-suite-practice',
    title: 'Burp Suite Practice',
    summary:
      'Used Burp Suite in lab scenarios to understand requests, responses, interception, and common web application testing workflows.',
    focus: 'Web security testing fundamentals',
    tools: ['Burp Suite', 'Browser DevTools'],
    level: 'Beginner',
    status: 'ready',
    writeupStatus: 'summary-ready',
  },
]

export const SECURITY_PRACTICALS = PRACTICALS.map((item) => ({
  platform: item.focus,
  title: item.title,
  summary: item.summary,
}))

export const SERVICE_OFFERINGS = [
  {
    slug: 'mentorship-call',
    name: '1:1 Mentorship',
    category: 'Guidance',
    price: 'INR 99',
    turnaround: 'Schedule-based',
    summary:
      'A short student-friendly session for guidance on web development, project direction, learning roadmaps, or portfolio improvement.',
  },
  {
    slug: 'resume-review-help',
    name: 'Resume Review and Help',
    category: 'Career Support',
    price: 'INR 149',
    turnaround: '1 to 2 days',
    summary:
      'Resume feedback and improvement support for students and freshers who want a cleaner, stronger technical profile.',
  },
  {
    slug: 'portfolio-guidance',
    name: 'Portfolio Guidance',
    category: 'Guidance',
    price: 'INR 99',
    turnaround: '1 to 2 days',
    summary:
      'Guidance for students who want to improve portfolio structure, project presentation, and personal branding.',
  },
  {
    slug: 'frontend-development',
    name: 'Frontend Development',
    category: 'Build and Delivery',
    price: 'INR 1099 - 1499',
    turnaround: '3 to 5 days for basic scope',
    summary:
      'Responsive frontend modules or small websites focused on clean UI, usability, and handover clarity.',
  },
  {
    slug: 'backend-development',
    name: 'Backend Development',
    category: 'Build and Delivery',
    price: 'INR 1299 - 1799',
    turnaround: '3 to 6 days',
    summary:
      'Node.js and Express-based backend support for APIs, validation, routing, and simple data workflows.',
  },
  {
    slug: 'full-stack-development',
    name: 'Full Stack Development',
    category: 'Build and Delivery',
    price: 'INR 2999 - 3499',
    turnaround: 'Depends on scope',
    summary:
      'Small full stack builds with frontend, backend, database integration, and basic deployment support.',
  },
  {
    slug: 'website-security-review',
    name: 'Website Security Review',
    category: 'Cyber Security',
    price: 'INR 2499 - 4999',
    turnaround: 'Depends on scope',
    summary:
      'Basic website security review for owned websites or explicitly authorized targets only.',
  },
]

export const BLOG_LINKS = [
  {
    slug: 'learning-cybersecurity-web-development-and-ai-together',
    title:
      "How I'm Learning Cybersecurity, Web Development, and AI Together as a BCA Student",
    subtitle:
      "A beginner's roadmap built from curiosity, experimentation, and steady practice.",
    source: 'Medium',
    url: 'https://medium.com/@nikhilxagr/artificial-intelligence-concepts-for-beginnershow-im-learning-cybersecurity-web-development-and-a899bc6b4d1c',
    excerpt:
      'A reflection on learning across three connected areas and building a realistic roadmap as a student.',
    tags: ['Cybersecurity', 'Web Development', 'AI', 'Student Journey'],
    featured: true,
  },
  {
    slug: 'chatbots-and-the-mindset-of-college-students',
    title:
      'How Chatbots Are Shaping the Mindset of College Students: A Double-Edged Sword',
    subtitle:
      'A look at how AI tools influence habits, thinking, and learning behavior.',
    source: 'LinkedIn',
    url: 'https://www.linkedin.com/pulse/how-chatbots-shaping-mindset-college-students-sword-nikhil-agrahari-gjhbf/',
    excerpt:
      'An opinion piece exploring opportunities and risks that chatbot-driven learning brings to students.',
    tags: ['AI', 'Education', 'College Students'],
    featured: false,
  },
  {
    slug: 'how-metro-systems-work',
    title:
      'How Metro Systems Work: Token Allocation, Technology Behind the Scenes and the Future of Driverless Trains',
    subtitle:
      'A curiosity-driven breakdown of public transport technology and its future.',
    source: 'LinkedIn',
    url: 'https://www.linkedin.com/pulse/how-metro-systems-work-token-allocation-technology-behind-agrahari-wgxqf/',
    excerpt:
      'A practical look at systems and technology that power metro networks and modern rail experiences.',
    tags: ['Technology', 'Infrastructure', 'Innovation'],
    featured: false,
  },
  {
    slug: 'india-produces-toppers-the-world-produces-innovators',
    title:
      'India Produces Toppers. The World Produces Innovators. Why Are We Falling Behind?',
    subtitle:
      'A student perspective on education, problem solving, and the gap between marks and innovation.',
    source: 'LinkedIn',
    url: 'https://www.linkedin.com/pulse/india-produces-toppers-world-innovators-why-we-falling-agrahari-fyp0c/',
    excerpt:
      'A reflective piece on the difference between exam-oriented success and innovation-oriented learning.',
    tags: ['Education', 'Innovation', 'Student Perspective'],
    featured: false,
  },
]

export const LEGAL_NOTICES = {
  securityTesting:
    'Security testing is offered only for owned websites or targets where the client has clear written permission.',
  portfolioDisclaimer:
    'This portfolio presents real learning, real projects, and ethical security practice only.',
  practicalsEthics:
    'All security practice is limited to labs, owned systems, or explicitly authorized targets.',
}