export const PROJECT_CATEGORIES = ["All", "Web Dev", "Python", "Cyber Security", "AI"];

export const SIGNATURE_PROJECTS = [
  {
    slug: "kanoon-mate",
    title: "Kanoon-Mate",
    subtitle: "AI-Powered Legal Operating System",
    category: "AI",
    tagline: "AI-Powered Legal Operating System developed during Nerds Hack Days Lucknow",
    description:
      "Kanoon-Mate is an AI-powered Legal Operating System developed during Nerds Hack Days Lucknow. It simplifies legal documents, detects relevant laws, provides AI-driven legal guidance, and demonstrates intelligent case tracking for citizens and lawyers.",
    overview:
      "Kanoon-Mate is an AI-powered Legal Operating System built during Nerds Hack Days Lucknow by Team Bro Code. The platform leverages Generative AI and intelligent workflow automation to simplify legal documents, explain legal concepts in plain language, identify applicable laws, assess legal risks, and guide users through the next steps in their legal journey. Beyond document analysis, Kanoon-Mate introduces an AI-powered case tracking workflow that demonstrates how legal updates can be intelligently managed for both citizens and legal professionals.",
    problemStatement:
      "Millions of citizens struggle to understand legal documents, while lawyers spend considerable time manually tracking hearing dates, court orders, and case progress.",
    solutionSummary:
      "Built an AI-powered Legal Operating System that combines document intelligence, AI-assisted legal guidance, workflow automation, and intelligent case tracking into a single platform.",
    outcome:
      "Developed a functional AI-powered LegalTech prototype within the hackathon, demonstrating AI-assisted legal document understanding and an intelligent case tracking workflow.",
    tags: [
      "Hackathon Project",
      "Collaboration Project",
    ],
    highlights: [
      "📄 AI Legal Document Analysis & Summarization",
      "⚖️ Relevant Law & Section Detection",
      "🤖 AI-Powered Legal Guidance",
      "🚨 Risk Assessment & Next-Step Recommendations",
      "📅 Hearing Timeline & Deadline Tracking",
      "🔔 Smart Notifications",
      "🧠 Multi-Agent AI Workflow",
      "⚡ AI Case Tracking Prototype",
    ],
    challenges: [
      "Designing a scalable AI workflow within a limited hackathon timeframe.",
      "Demonstrating automated case tracking without direct access to live court systems.",
      "Building an intuitive LegalTech experience for both citizens and lawyers.",
      "Coordinating development, UI, AI integration, and pitching as a team under strict deadlines.",
    ],
    outcomes: [
      "Developed a functional AI-powered LegalTech prototype within the hackathon.",
      "Successfully demonstrated AI-assisted legal document understanding.",
      "Designed an intelligent AI case tracking workflow for future scalability.",
      "Enhanced skills in AI integration, rapid prototyping, teamwork, and product pitching.",
    ],
    techStackGrouped: {
      Frontend: ["React", "Tailwind CSS"],
      Backend: ["Node.js", "Express.js"],
      Database: ["MongoDB"],
      "AI & Automation": ["Gemini API", "OCR", "AI Workflow Design"],
      Tools: ["Git", "GitHub", "Vercel", "Figma"],
    },
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "Gemini API",
    ],
    collaboration: {
      team: "Bro Code",
      members: ["Nikhil Agrahari", "Gaurav Kumar Yadav", "Devansh Yadav"],
      context:
        "Built collaboratively during Nerds Hack Days Lucknow, combining expertise in Full-Stack Development, AI integration, UI/UX, and product strategy.",
    },
    learnings: [
      "Multi-Agent AI Architecture",
      "Prompt Engineering",
      "Rapid MVP Development",
      "AI Workflow Design",
      "Team Collaboration",
      "Product Thinking",
      "Technical Pitching",
      "Problem Solving Under Time Constraints",
    ],
    status: "Completed ✅ (Built during Nerds Hack Days Lucknow 2026)",
    githubUrl: "https://github.com/nikhilxagr/Kanoon-Mate--HackethonProjects-",
    liveDemoUrl: "",
    imageUrl: "/images/projects/kanoon-mate-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "fast-feast",
    title: "Fast Feast",
    category: "Web Dev",
    tagline:
      "A modern food delivery experience with a clean browsing and ordering flow.",
    description:
      "Fast Feast is a frontend-focused food delivery project built to simulate the experience of exploring menus, adding items to a cart, and following a smooth order journey.",
    problemStatement:
      "The goal was to build a user-friendly food delivery interface that felt modern, simple to navigate, and visually engaging.",
    solutionSummary:
      "The project demonstrates layout design, responsive UI structure, and clean interaction flow using core web technologies.",
    outcome:
      "Demonstrated end-to-end user flow clarity, responsive UI quality, and practical frontend implementation discipline.",
    highlights: [
      "Interactive menu browsing",
      "Cart functionality",
      "Order tracking interface",
      "Responsive frontend layout",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Food%20Delivery%20Website",
    liveDemoUrl: "https://fastfeast-agr.netlify.app/",
    imageUrl: "/images/projects/fast-feast-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "snapurl",
    title: "snapURL",
    category: "Web Dev",
    tagline: "A MERN-based URL shortener for clean, shareable links.",
    description:
      "snapURL is a full stack URL shortener that helps users convert long URLs into compact links that are easier to share, organize, and manage.",
    problemStatement:
      "Long links are difficult to share neatly, especially across social posts, student work, and project documentation.",
    solutionSummary:
      "This project shows end-to-end application development with a React frontend, Express backend, and MongoDB-powered data flow.",
    outcome:
      "Built a full stack production-style workflow with API integration, persistence, and a practical URL utility use-case.",
    highlights: [
      "Short link generation",
      "Frontend and backend integration",
      "REST API workflow",
      "Database-backed URL management",
    ],
    techStack: [
      "React",
      "React Router DOM",
      "JavaScript",
      "Axios",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
    ],
    githubUrl: "https://github.com/nikhilxagr/snapurl-URL-SHORTNER",
    liveDemoUrl: "https://snapurl-url-shortner.vercel.app/",
    imageUrl: "/images/projects/snapurl-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "ai-powered-code-reviewer",
    title: "AI Powered Code Reviewer",
    category: "AI",
    tagline:
      "An AI-assisted review platform focused on code quality and developer support.",
    description:
      "AI Powered Code Reviewer is a MERN-based platform designed to analyze code, highlight issues, suggest improvements, and maintain code quality standards in a more streamlined workflow.",
    problemStatement:
      "Developers often need faster feedback on code quality, possible bugs, and maintainability without losing track of previous reviews.",
    solutionSummary:
      "This project reflects interest in AI-assisted developer tooling, secure access control, and building feature-rich full stack platforms.",
    outcome:
      "Showcased AI-assisted developer workflow design with strong focus on productivity and secure collaboration paths.",
    highlights: [
      "AI-based code review flow",
      "Security scanning direction",
      "Authentication and user management",
      "Review history tracking",
    ],
    techStack: ["MongoDB", "Express.js", "React", "Node.js"],
    githubUrl:
      "https://github.com/nikhilxagr/AI-Powered-Code-Reviewer-MERN-Project",
    liveDemoUrl: "",
    imageUrl: "/images/projects/ai-powered-code-reviewer-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "notes-app",
    title: "Notes App",
    category: "Web Dev",
    tagline:
      "A sleek, fast, local-storage powered note-taking web application.",
    description:
      "Notes App is an intuitive note management web application designed for creating, organizing, editing, and deleting personal notes with real-time local storage persistence and responsive card layouts.",
    problemStatement:
      "Users need a lightweight, fast, distraction-free tool to capture quick thoughts, organize notes, and maintain data across sessions without requiring complex user logins.",
    solutionSummary:
      "Built using core web technologies (HTML5, CSS3, JavaScript) featuring dynamic DOM manipulation, real-time input validation, local storage auto-sync, and responsive UI design.",
    outcome:
      "Delivered a practical web utility with instant load time, zero external dependencies, and smooth user interaction flow across all devices.",
    highlights: [
      "Dynamic note creation & editing",
      "LocalStorage data persistence",
      "Instant search & category filtering",
      "Responsive UI card layout",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Notes%20App",
    liveDemoUrl: "https://notes-app-agr.netlify.app/",
    imageUrl: "/images/projects/notes-app-cover.webp",
    featured: true,
  },
  {
    slug: "qrcode-generator",
    title: "QRCode Generator",
    category: "Web Dev",
    tagline:
      "An instant, customizable QR code generation utility for links, text, and data.",
    description:
      "QRCode Generator is an interactive web tool built to create scannable, high-resolution QR codes dynamically for web URLs, Wi-Fi details, text snippets, and contact information with instant live download capability.",
    problemStatement:
      "Users and businesses frequently need quick, reliable, ad-free tools to convert links and text into downloadable QR codes without data privacy risks.",
    solutionSummary:
      "Developed using HTML5, CSS3, and modern JavaScript API integrations to generate vector-rendered QR codes with custom size options, instant live preview, and high-quality image download features.",
    outcome:
      "Delivered a practical utility tool with instant client-side generation, clean UI feedback, and universal cross-device browser compatibility.",
    highlights: [
      "Real-time QR code rendering",
      "Instant image download capability",
      "Custom input URL & text support",
      "Clean, responsive interface",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/QR%20Code%20Generator",
    liveDemoUrl: "https://qrcode-generator-agr.netlify.app/",
    imageUrl: "/images/projects/qrcode-generator-cover.webp",
    featured: true,
  },
  {
    slug: "weather-app",
    title: "Weather App",
    category: "Web Dev",
    tagline:
      "A real-time weather forecasting web application powered by OpenWeather API.",
    description:
      "Weather App is a responsive, interactive web application built to fetch real-time atmospheric data, temperature, humidity, wind speed, and weather condition forecasts for cities worldwide via external REST API integration.",
    problemStatement:
      "Users need an easy, instant way to search and view current weather metrics, forecasts, and atmospheric conditions for any global location without heavy page reloads.",
    solutionSummary:
      "Developed using core web standards (HTML5, CSS3, JavaScript) with asynchronous fetch API calls, JSON data parsing, dynamic weather condition icon mapping, and user error handling for invalid city queries.",
    outcome:
      "Delivered a fast, responsive weather dashboard with live API data fetching, smooth card transitions, and clean mobile-first layout UI.",
    highlights: [
      "Real-time OpenWeather API integration",
      "Global city search with auto-fetch",
      "Dynamic weather condition icons & metrics",
      "Responsive card layout & glassmorphic design",
    ],
    techStack: ["HTML", "CSS", "JavaScript", "REST API"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Weather%20App%20(%20Using%20API%20)",
    liveDemoUrl: "https://weatherappagr.netlify.app/",
    imageUrl: "/images/projects/weather-app-cover.webp",
    featured: true,
  },
  {
    slug: "todo-list-app",
    title: "To Do List App",
    category: "Web Dev",
    tagline:
      "A clean, productive task management web application with browser persistence.",
    description:
      "To Do List App is a lightweight, responsive task management application designed to help users create, organize, mark complete, and delete daily tasks with instant browser local storage persistence.",
    problemStatement:
      "Individuals need a quick, distraction-free tool to organize daily priorities, check off completed goals, and preserve task states across browser refreshes.",
    solutionSummary:
      "Built using core web technologies (HTML5, CSS3, JavaScript) featuring dynamic DOM node creation, event delegation, strike-through task completion toggles, and local storage auto-sync.",
    outcome:
      "Delivered a practical daily productivity utility with zero load delay, clean interactive UX feedback, and mobile-responsive layout execution.",
    highlights: [
      "Task creation, completion & deletion",
      "LocalStorage data persistence",
      "Interactive completion checkmarks",
      "Responsive card UI layout",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/To%20do%20List",
    liveDemoUrl: "https://todo-list-agr.netlify.app/",
    imageUrl: "/images/projects/todo-list-cover.webp",
    featured: true,
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    category: "Web Dev",
    tagline:
      "An exact age calculation web utility that computes years, months, and days dynamically.",
    description:
      "Age Calculator is an interactive web tool built to calculate precise chronological age in years, months, and days based on a user's date of birth with real-time input validation and leap year accounting.",
    problemStatement:
      "Users often need to calculate exact age metrics for application forms, official verification, and milestone tracking without manual calendar math errors.",
    solutionSummary:
      "Developed using core web standards (HTML5, CSS3, JavaScript) featuring JS Date object methods, leap year algorithms, edge-case date validation, and responsive result cards.",
    outcome:
      "Delivered a fast, reliable calculation tool with instant feedback, zero external dependencies, and smooth user experience across mobile and desktop devices.",
    highlights: [
      "Exact years, months & days calculation",
      "Leap year & date edge-case validation",
      "Real-time dynamic result display",
      "Clean responsive card layout",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Age%20Calculator",
    liveDemoUrl: "https://age-calc-agr.netlify.app/",
    imageUrl: "/images/projects/age-calculator-cover.webp",
    featured: true,
  },
  {
    slug: "text-to-speech",
    title: "Text To Speech Converter",
    category: "Web Dev",
    tagline:
      "An interactive web application that converts text into natural-sounding spoken audio.",
    description:
      "Text To Speech Converter is a responsive web application leveraging the browser-native Web Speech API to convert written text into natural vocal narration with customizable voice selection, pitch, rate, and playback controls.",
    problemStatement:
      "Users and content creators need an instant, free, accessible tool to listen to written text, verify pronunciation, and audit audio readability without installing external software.",
    solutionSummary:
      "Developed using core web standards (HTML5, CSS3, JavaScript) incorporating `window.speechSynthesis` API bindings, dynamic voice dropdown population, live speech controls (play/pause/stop), and volume modulation.",
    outcome:
      "Built a browser-accessible audio converter featuring instant voice synthesis, zero latency, and seamless responsive controls across desktop and mobile devices.",
    highlights: [
      "Browser Web Speech API integration",
      "Dynamic voice & accent dropdown selection",
      "Interactive play, pause & stop controls",
      "Responsive card UI with volume slider",
    ],
    techStack: ["HTML", "CSS", "JavaScript", "Web Speech API"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Text%20To%20Speech",
    liveDemoUrl: "https://text-to-speech-agr.netlify.app/",
    imageUrl: "/images/projects/text-to-speech-cover.webp",
    featured: true,
  },
  {
    slug: "music-player",
    title: "Music Player",
    category: "Web Dev",
    tagline:
      "A sleek, interactive web music player with audio controls, playlists, and progress tracking.",
    description:
      "Music Player is a modern, responsive web application designed for playing audio tracks with smooth track navigation, interactive seek bar, volume modulation, playlist queuing, and album artwork visualization.",
    problemStatement:
      "Users need an intuitive, fast, ad-free web audio player interface with smooth playback controls, real-time track progress visualizers, and responsive media handling.",
    solutionSummary:
      "Developed using core web standards (HTML5 Audio API, CSS3 glassmorphism, JavaScript) featuring custom play/pause state management, dynamic seek progress sliders, track duration formatters, and playlist index switching.",
    outcome:
      "Delivered a feature-rich audio web utility with instant responsive controls, smooth track switching, and an aesthetically polished UI.",
    highlights: [
      "HTML5 Audio API integration",
      "Interactive seek bar & volume slider",
      "Playlist queuing & track navigation",
      "Sleek glassmorphic card design",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Music%20Player",
    liveDemoUrl: "https://music-player-agr.netlify.app/",
    imageUrl: "/images/projects/music-player-cover.webp",
    featured: true,
  },
  {
    slug: "mini-calendar",
    title: "Mini Calendar App",
    category: "Web Dev",
    tagline:
      "A real-time, dynamic date & month calendar widget with aesthetic date tracking.",
    description:
      "Mini Calendar App is a sleek, lightweight web application built to display real-time date metrics including current day, month, date number, and year dynamically synchronized with the user's system clock.",
    problemStatement:
      "Developers and users need a fast, minimal calendar widget component for dashboard interfaces, scheduling utilities, and date verification.",
    solutionSummary:
      "Developed using core web standards (HTML5, CSS3, JavaScript) incorporating JS `Date` constructor methods, array formatting for month/day names, and glassmorphic card UI styling.",
    outcome:
      "Delivered a lightweight, zero-dependency date widget with instant system clock auto-update and mobile-responsive aesthetic design.",
    highlights: [
      "Real-time system clock synchronization",
      "Dynamic month, day & year formatting",
      "Sleek glassmorphic card layout",
      "Lightweight zero-dependency architecture",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Mini%20Calendar",
    liveDemoUrl: "https://mini-calender-agr.netlify.app/",
    imageUrl: "/images/projects/mini-calendar-cover.webp",
    featured: true,
  },
  {
    slug: "upi-qrcode-generator",
    title: "UPI QR Code Generator",
    category: "Python",
    tagline:
      "A desktop GUI utility in Python & Tkinter for generating instant payment UPI QR codes.",
    description:
      "UPI QR Code Generator is a desktop GUI application built in Python using Tkinter and Pillow. It generates dynamic, scannable Unified Payments Interface (UPI) QR codes embedded with merchant VPA ID, payee name, transaction note, and exact billing amount.",
    problemStatement:
      "Small merchants and freelancers need a standalone, desktop-offline tool to generate instant payment QR codes for custom billing amounts without relying on web connections.",
    solutionSummary:
      "Engineered using Python, Tkinter GUI library, `qrcode` library, and Pillow image rendering to construct NPCI-compliant UPI URI strings (`upi://pay?pa=...`), render vector matrix codes, and export PNG images.",
    outcome:
      "Delivered a lightweight, desktop payment utility with instant GUI rendering, input field validation, and offline image export capabilities.",
    highlights: [
      "Tkinter desktop GUI interface",
      "NPCI compliant UPI payment URI string construction",
      "Dynamic VPA, payee name & amount parameters",
      "Instant high-res PNG export & preview",
    ],
    techStack: ["Python", "Tkinter", "Pillow", "QRCode Lib"],
    githubUrl:
      "https://github.com/nikhilxagr/Python-projects/tree/main/QR%20Code%20Generator",
    liveDemoUrl: "",
    imageUrl: "/images/projects/upi-qrcode-generator-cover.webp",
    featured: true,
  },
  {
    slug: "tic-tac-toe-python",
    title: "Tic Tac Toe (Python GUI)",
    category: "Python",
    tagline:
      "A classic 2-player desktop Tic Tac Toe game interface built using Python & Tkinter.",
    description:
      "Tic Tac Toe is an interactive desktop GUI game built in Python featuring dynamic 3x3 grid button layouts, turn-based X & O move logic, win/draw detection algorithms, score counters, and instant game reset controls.",
    problemStatement:
      "Learners and game enthusiasts need a lightweight desktop demonstration of matrix state management, event-driven GUI programming, and conditional win-checking algorithms in Python.",
    solutionSummary:
      "Developed using Python's native `tkinter` GUI framework featuring 2D array matrix state tracking, linear & diagonal win evaluation functions, score state persistence, and responsive popup alert dialogues.",
    outcome:
      "Delivered a fun, responsive desktop game application showcasing clean object-oriented Python code structuring and GUI event handling.",
    highlights: [
      "Tkinter interactive 3x3 grid GUI",
      "Turn-based player turn management",
      "Automatic win & draw condition detection",
      "Scoreboard tracking & game reset feature",
    ],
    techStack: ["Python", "Tkinter", "OOP"],
    githubUrl:
      "https://github.com/nikhilxagr/Python-projects/tree/main/Tic%20Tac%20Toe%20Game",
    liveDemoUrl: "",
    imageUrl: "/images/projects/tic-tac-toe-cover.webp",
    featured: true,
  },
];
