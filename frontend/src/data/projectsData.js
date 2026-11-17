export const PROJECT_CATEGORIES = ["All", "Web Dev", "Python", "Cyber Security", "AI"];

export const SIGNATURE_PROJECTS = [
  {
    slug: "whatsapp-fullstack-clone",
    title: "WhatsApp Clone",
    subtitle: "Real-time chat app with status stories, reactions, and OTP login",
    category: "Full Stack",
    tagline:
      "Socket.IO messaging app with read receipts, Cloudinary media uploads, and dual Email/SMS verification.",
    description:
      "A web messaging client supporting live 1-on-1 chat, image and video attachments, message reactions, read receipts, and 24-hour status updates.",
    overview:
      "Built on React 19, Express 5, MongoDB Atlas, and Socket.IO to keep message delivery, typing state, and online presence synchronized across browser tabs. Media uploads stream to Cloudinary while 24-hour status records clear automatically using MongoDB TTL indexes.",
    problemStatement:
      "Real-time chat apps break down when socket connections drop mid-conversation, read states drift out of order across open tabs, or temporary status uploads pile up in the database.",
    solutionSummary:
      "Connected dedicated Socket.IO rooms for delivery and read acknowledgments, attached Multer and Cloudinary for direct media URLs, set 86,400-second MongoDB TTL indexes on stories, and paired Nodemailer email OTPs with Twilio SMS verification.",
    outcome:
      "Delivered a responsive chat workspace with live sent/delivered/read ticks, message reactions, auto-expiring stories with viewer counts, and persistent JWT cookie sessions.",
    projectType: "Solo",
    tags: [
      "React 19",
      "Node.js",
      "Express 5",
      "Socket.IO",
      "MongoDB",
      "Cloudinary",
      "JWT",
      "Tailwind CSS",
      "Nodemailer",
      "Twilio",
    ],
    highlights: [
      "Direct Messaging: Live 1-on-1 chat synchronized through Socket.IO rooms and delivery acknowledgments.",
      "Media Attachments: Upload and preview images or videos inside conversations via Multer and Cloudinary.",
      "Receipts & Reactions: Real-time sent, delivered, and read tick updates alongside message emoji reactions.",
      "24-Hour Status Stories: Post text, photo, or video updates that expire automatically after 86,400 seconds.",
      "Dual OTP Login: Verify accounts with 6-digit codes sent by Email (Nodemailer) or SMS (Twilio) using HTTP-only JWT cookies.",
      "Presence & Typing: Shows live online status, last-seen timestamps, and debounced 3-second typing indicators.",
    ],
    challenges: [
      "Reconciling socket connection states cleanly when users refresh tabs or switch between Wi-Fi and mobile networks.",
      "Automating 24-hour story deletion at the database level via MongoDB TTL indexes rather than running separate cron jobs.",
      "Supporting both SMTP email and Twilio SMS verification routes with clear validation and fallback error responses.",
      "Handling multipart file uploads so inline photos and videos play cleanly without blocking socket events.",
    ],
    outcomes: [
      "Unified REST API routes and Socket.IO event listeners across React 19 and Express 5.",
      "Eliminated expired story clutter automatically through MongoDB schema TTL indexing.",
      "Protected user sessions with dual-channel OTP sign-in and HTTP-only cookie tokens.",
      "Deployed the live client on Vercel with real-time messaging across desktop and mobile.",
    ],
    techStackGrouped: {
      Frontend: ["React 19", "Tailwind CSS", "Axios", "Firebase SDK"],
      Backend: ["Node.js", "Express 5", "REST API", "Multer", "Cookie-Parser"],
      Database: ["MongoDB Atlas", "Mongoose 9 (TTL Indexes)"],
      "Real-Time & Media": ["Socket.IO v4", "Cloudinary CDN"],
      "Auth & Messaging": ["JWT", "Nodemailer (Email OTP)", "Twilio (SMS OTP)"],
    },
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "Socket.io",
      "MongoDB",
      "Cloudinary",
      "JWT",
      "Tailwind CSS",
    ],
    collaboration: {
      team: "Solo Architecture",
      members: ["Nikhil Agrahari (Full Stack Developer & Architect)"],
      context:
        "Built independently to practice stateful WebSocket architectures, media upload pipelines, and multi-channel verification.",
    },
    learnings: [
      "Managing Socket.IO room memberships, presence updates, and automatic reconnect lifecycles.",
      "Using MongoDB TTL indexes to enforce 24-hour expiration without scheduled background scripts.",
      "Handling dual-channel Email and SMS OTP delivery with consistent validation errors.",
      "Configuring HTTP-only JWT cookies and strict CORS settings across split client/server deployments.",
      "Streaming user media through Multer into Cloudinary optimization URLs.",
    ],
    status: "Completed (Live on Vercel)",
    githubUrl: "https://github.com/nikhilxagr/whatsapp-fullstack-clone",
    liveDemoUrl: "https://whatsapp-webclone.vercel.app/",
    imageUrl: "/images/projects/whatsapp-clone-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "vistagram",
    title: "VISTAGRAM",
    subtitle: "Social networking app with Reels, stories, and direct messaging",
    category: "Full Stack",
    tagline:
      "MERN social platform featuring Redux Toolkit state caching, Cloudinary video feeds, and WebSocket alerts.",
    description:
      "A social web application supporting photo feeds, snap-scrolling short Reels, temporary stories, nested comment moderation, and live chat.",
    overview:
      "VISTAGRAM runs a normalized Redux Toolkit frontend connected to Express REST endpoints, MongoDB collections, and Cloudinary media storage. WebSocket events drive direct messages and live interaction alerts, while both HTTP-only cookies and Bearer tokens authenticate cross-origin requests.",
    problemStatement:
      "Media-heavy social feeds feel sluggish when video players stall during scroll, nested comments cause stale feed counts, or browser cookie policies reject cross-domain sessions.",
    solutionSummary:
      "Organized feeds, stories, and alerts into Redux Toolkit slices, offloaded image and video encoding to Cloudinary, connected direct messages over Socket.IO, and added dual cookie + Bearer token auth.",
    outcome:
      "Shipped a responsive web client on Vercel alongside a companion Android WebView APK with feeds, video Reels, stories, bookmarks, and real-time chat.",
    projectType: "Solo",
    tags: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.io",
      "Redux Toolkit",
      "Cloudinary",
      "Tailwind CSS",
      "JWT",
    ],
    highlights: [
      "Direct Chat: Send live text messages and photos over Socket.IO with active online indicators.",
      "24-Hour Stories: View photo and video updates with progress bars, hold-to-pause playback, and viewer lists.",
      "Vertical Reels: Snap-scrolling short video player with scrubbing controls and slide-up comment threads.",
      "Posts & Bookmarks: Create, edit, and delete posts with optimistic like toggles, saved lists, and share modals.",
      "Threaded Comments: Nested discussions supporting likes, long-press author deletion, and ownership checks.",
      "Live Notifications: Instant WebSocket updates when other users like, comment, or follow.",
      "Dual Auth Support: Accepts HTTP-only cookies or Bearer headers for reliable cross-domain API requests.",
    ],
    challenges: [
      "Keeping scroll smooth by pausing and mounting HTML5 video elements cleanly inside snap-scroll Reels containers.",
      "Updating likes, comment totals, and saved collections in Redux without desynchronizing profile and feed views.",
      "Enforcing server-side edit and delete permissions across nested comment threads.",
      "Supporting cross-origin hosting reliably despite strict third-party browser cookie rules.",
    ],
    outcomes: [
      "Built complete social features covering home feeds, short Reels, temporary stories, and 1-on-1 chat.",
      "Centralized application state in Redux Toolkit across profile grids, notifications, and conversations.",
      "Optimized photo and video load sizes through Cloudinary delivery parameters.",
      "Published the live site on Vercel and packaged a downloadable Android APK build.",
    ],
    techStackGrouped: {
      Frontend: ["React (Vite)", "Redux Toolkit", "Tailwind CSS", "Axios"],
      Backend: ["Node.js", "Express.js", "Socket.IO", "Multer"],
      Database: ["MongoDB", "Mongoose"],
      "Media & Auth": ["Cloudinary API", "JWT (Cookies + Bearer)"],
      Tools: ["Git", "GitHub", "Vercel", "Postman"],
    },
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.io",
      "Redux Toolkit",
      "Cloudinary",
      "Tailwind CSS",
      "JWT",
    ],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Full Stack Developer)"],
      context:
        "Built independently from database modeling and WebSocket integration through Vercel deployment and Android packaging.",
    },
    learnings: [
      "Normalizing Redux Toolkit state so likes and edits stay synchronized across routes.",
      "Controlling active video element lifecycles inside viewport-snapped Reels views.",
      "Combining HTTP-only cookies and Bearer JWT headers for cross-domain SPA requests.",
      "Pairing real-time Socket.IO alerts with persistent MongoDB notification records.",
      "Using Cloudinary transformations for aspect-ratio cropping and video streaming.",
    ],
    status: "Completed (Live on Vercel)",
    githubUrl: "https://github.com/nikhilxagr/Vistagram",
    liveDemoUrl: "https://myvistagram.vercel.app/",
    apkUrl: "/Vistagram.apk",
    imageUrl: "/images/projects/vistagram-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "kanoon-mate",
    title: "Kanoon-Mate",
    subtitle: "AI legal document assistant and case timeline prototype",
    category: "AI",
    tagline:
      "Hackathon LegalTech platform built with React, Node.js, MongoDB, and the Gemini API to explain notices and organize court dates.",
    description:
      "A collaborative hackathon tool that converts legal documents into plain-language summaries, highlights relevant laws, and organizes hearing deadlines.",
    overview:
      "Built at Nerds Hack Days Lucknow by Team Bro Code, Kanoon-Mate feeds uploaded notices and legal text into Gemini prompt steps that extract entities, plain-language explanations, and statutory references. Extracted dates populate a structured hearing timeline stored in MongoDB.",
    problemStatement:
      "Dense legal paperwork makes it hard for citizens to understand obligations, while manual date tracking increases the risk of missed deadlines or filings.",
    solutionSummary:
      "Chained text extraction with structured Gemini API prompts to produce clear summaries, applicable statutory notes, risk checklists, and a chronological case tracker.",
    outcome:
      "Delivered a working hackathon prototype covering document upload, plain-language explanation, risk flags, and hearing timeline organization during live judging.",
    projectType: "Collaboration",
    tags: [
      "Hackathon",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Gemini API",
      "Tailwind CSS",
    ],
    highlights: [
      "Document Summaries: Translates technical legal filings into clear, readable bullet points.",
      "Law & Section Lookup: Surfaces statutory provisions and legal concepts referenced inside uploaded text.",
      "Risk & Next Steps: Lists immediate obligations, potential risks, and preparatory checklist items.",
      "Hearing Timeline: Organizes court dates, filing deadlines, and status milestones in chronological order.",
      "OCR Input Support: Extracts clean text from scanned notice uploads before prompting Gemini.",
      "Dual Views: Pairs simple citizen explanations with structured timeline cards for legal review.",
    ],
    challenges: [
      "Constraining AI outputs into predictable structured sections grounded in the submitted text under hackathon time limits.",
      "Simulating practical hearing timeline tracking without direct access to public court databases.",
      "Designing a calm reading layout for non-technical users reviewing stressful notices.",
      "Coordinating React UI, backend routes, OCR parsing, and pitch prep smoothly across three teammates.",
    ],
    outcomes: [
      "Built and demoed a working AI document review prototype within the 24-hour hackathon window.",
      "Demonstrated plain-language clause breakdown and deadline extraction cleanly to judges.",
      "Separated OCR parsing, prompt chaining, and timeline storage into modular backend routes.",
      "Gained practical experience coordinating API contracts under strict team deadlines.",
    ],
    techStackGrouped: {
      Frontend: ["React", "Tailwind CSS"],
      Backend: ["Node.js", "Express.js"],
      Database: ["MongoDB"],
      "AI & Document Flow": ["Gemini API", "OCR Extraction", "Prompt Chaining"],
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
      team: "Bro Code (Nerds Hack Days Lucknow)",
      members: ["Nikhil Agrahari", "Gaurav Kumar Yadav", "Devansh Yadav"],
      context:
        "Built as a three-person team during Nerds Hack Days Lucknow across full-stack APIs, AI prompt architecture, UI design, and pitching.",
    },
    learnings: [
      "Using schema-guided prompt responses so React components always receive reliable keys.",
      "Breaking text extraction, statutory lookup, and summarization into focused API steps.",
      "Trimming scope ruthlessly to finish an end-to-end demoable workflow before submission.",
      "Defining clean request and response contracts early across frontend and backend teammates.",
    ],
    status: "Completed (Nerds Hack Days Lucknow 2026)",
    githubUrl: "https://github.com/nikhilxagr/Kanoon-Mate--HackethonProjects-",
    liveDemoUrl: "",
    imageUrl: "/images/projects/kanoon-mate-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "smart-lms",
    title: "Smart LMS",
    subtitle: "Course platform with semantic search and Razorpay checkout",
    category: "Full Stack",
    tagline:
      "Multi-role e-learning system using Redux Toolkit, Google OAuth 2.0, verified Razorpay webhooks, and Gemini search.",
    description:
      "A collaborative learning platform where instructors manage courses and students discover lessons via semantic search, sign in with Google, and pay through verified checkout.",
    overview:
      "Smart LMS separates instructor course publishing from student browsing and checkout on a shared MERN backend. Instead of trusting browser payment redirects or strict keyword matches, it authenticates users via Google OAuth 2.0, matches intent using Gemini search, and confirms enrollments through Razorpay webhook signatures.",
    problemStatement:
      "Basic LMS templates struggle with rigid exact-word search, inconsistent state between student and instructor views, and insecure checkout endpoints that grant access before server verification.",
    solutionSummary:
      "Built role-protected Express portals backed by MongoDB Atlas and Redux Toolkit state caching, added Google OAuth login, verified Razorpay HMAC signatures in webhook handlers, and integrated Gemini course search.",
    outcome:
      "Created a full-stack LMS workflow featuring automated webhook-driven course unlocks, fast cached navigation, natural-language course discovery, and OAuth onboarding.",
    projectType: "Collaboration",
    tags: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Redux Toolkit",
      "Razorpay",
      "Gemini API",
      "OAuth 2.0",
      "Tailwind CSS",
    ],
    highlights: [
      "Semantic Search: Matches natural-language student queries to relevant course topics via the Gemini API.",
      "Google OAuth 2.0: One-click account onboarding wired into role-aware session tokens.",
      "Verified Checkout: Validates Razorpay cryptographic webhook signatures server-side before granting course access.",
      "Redux Toolkit Caching: Persists course lists, cart entries, and dashboard data to cut duplicate API calls.",
      "Dual Role Portals: Separate workspaces for instructor curriculum publishing and student progress tracking.",
    ],
    challenges: [
      "Preventing spoofed enrollment calls by verifying Razorpay HMAC signatures directly inside backend webhook middleware.",
      "Enforcing server-side instructor vs student route permissions on every API controller.",
      "Keeping AI-driven semantic course lookup responsive without scanning large collections synchronously.",
      "Preserving guest cart items smoothly when users transition through Google OAuth sign-in.",
    ],
    outcomes: [
      "Automated course enrollment immediately after verified Razorpay webhook confirmation.",
      "Delivered unified student and instructor portals over shared Express REST APIs.",
      "Connected Google OAuth 2.0 sign-in with structured JWT session validation.",
      "Improved course discovery over basic MongoDB regex text queries.",
    ],
    techStackGrouped: {
      Frontend: ["React", "Redux Toolkit", "Tailwind CSS"],
      Backend: ["Node.js", "Express.js", "Mongoose", "REST API"],
      Database: ["MongoDB Atlas"],
      "Auth & Payments": ["Google OAuth 2.0", "JWT", "Razorpay Webhooks"],
      "AI Search": ["Google Gemini API", "Semantic Matching"],
    },
    techStack: [
      "React",
      "Tailwind CSS",
      "Redux Toolkit",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "Google OAuth 2.0",
      "Razorpay",
      "Google Gemini API",
    ],
    collaboration: {
      team: "Smart LMS Team",
      members: [
        "Nikhil Agrahari (Backend Developer)",
        "Gaurav Kumar Yadav (Full Stack Developer)",
        "Khushi Sharma (Backend Developer & UI/UX)",
        "Devansh Yadav (Frontend Developer)",
      ],
      teamList: [
        {
          name: "Gaurav Kumar Yadav",
          role: "Full Stack Developer",
          portfolio: "https://ggauravky.vercel.app/",
        },
        {
          name: "Khushi Sharma",
          role: "Backend Developer & UI/UX",
          portfolio: "https://devkhushii.netlify.app/",
        },
        {
          name: "Nikhil Agrahari",
          role: "Backend Developer",
          portfolio: "https://nikhilxagr.vercel.app/",
        },
        {
          name: "Devansh Yadav",
          role: "Frontend Developer",
          portfolio: "https://ydevansh.vercel.app/",
        },
      ],
      context:
        "Built collaboratively across dedicated backend payment/auth services, frontend state management, and UI workflows.",
    },
    learnings: [
      "Verifying payment provider webhook signatures on raw request bodies instead of trusting client redirects.",
      "Checking user roles inside Express authorization middleware on every protected endpoint.",
      "Refreshing Redux slices cleanly right after checkout webhook completion.",
      "Falling back smoothly to standard database filters whenever external AI search calls time out.",
    ],
    status: "Completed (SaaS LMS Architecture)",
    githubUrl: "https://github.com/nikhilxagr/smart-lms-mern",
    liveDemoUrl: "",
    imageUrl: "/images/projects/smart-lms-cover.webp",
    featured: false,
    hasDetails: true,
  },
  {
    slug: "smartmess",
    title: "SmartMess",
    subtitle: "Hostel dining attendance, menus, and rating analytics app",
    category: "Full Stack",
    tagline:
      "Campus dining management platform with live menus, one-tap attendance, meal ratings, and ticketed complaints.",
    description:
      "A role-based platform connecting hostel residents and mess managers with live daily menus, digital meal check-ins, 1 to 5 star feedback, and complaint tracking.",
    overview:
      "SmartMess digitizes daily hostel mess operations by separating student feedback flows from staff administration tools on a shared MERN stack. Residents inspect all four meal menus, check in with one tap, and track complaints, while administrators approve accounts and inspect MongoDB rating trends.",
    problemStatement:
      "Paper attendance registers slowed down dining queues, students could not view daily menus in advance, complaints were lost in informal chats, and staff lacked reliable food quality numbers.",
    solutionSummary:
      "Built separate student and admin interfaces backed by role-verified Express REST endpoints, paginated check-in records, stateful complaint tickets, and MongoDB aggregation pipelines.",
    outcome:
      "Replaced manual attendance registers and group-chat complaints with one-tap check-ins, live menus, resolved ticket states, and weekly rating summaries deployed on Vercel.",
    projectType: "Collaboration",
    tags: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "Vercel",
      "Tailwind CSS",
    ],
    highlights: [
      "Live Meal Menus: Real-time breakfast, lunch, snacks, and dinner schedules published by administrators.",
      "Meal Feedback: Collects 1 to 5 star meal ratings and student comments per shift.",
      "One-Tap Attendance: Large mobile check-in buttons built for fast tap entry during busy meal hours.",
      "Ticketed Complaints: Tracks issues explicitly from Open through In Review to Resolved.",
      "Aggregation Trends: Summarizes per-meal rating averages, shift headcounts, and registration approvals.",
    ],
    challenges: [
      "Enforcing role-based access strictly inside Express JWT middleware rather than trusting client role props.",
      "Calculating multi-meal rating averages directly inside MongoDB aggregation stages to avoid large memory scans.",
      "Keeping mobile attendance controls simple enough for rushed students entering the dining hall.",
      "Adding paginated database queries early so daily check-in history stays responsive as records grow.",
    ],
    outcomes: [
      "Built dual-role React views for residents and hostel staff connected to Express and MongoDB.",
      "Replaced informal message complaints with traceable status transitions.",
      "Moved weekly rating and headcount math into fast MongoDB aggregation pipelines.",
      "Deployed the full application on Vercel serverless hosting.",
    ],
    techStackGrouped: {
      Frontend: ["React", "Tailwind CSS", "Vite", "React Router"],
      Backend: ["Node.js", "Express.js", "REST API"],
      Database: ["MongoDB Atlas", "Aggregation Pipelines"],
      Authentication: ["JWT", "Role-Based Access Control"],
      Deployment: ["Vercel"],
    },
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "Vercel",
      "Tailwind CSS",
    ],
    collaboration: {
      team: "SmartMess Core Team",
      members: [
        "Nikhil Agrahari (Backend Developer)",
        "Gaurav Kumar Yadav (Full Stack Developer)",
        "Devansh Yadav (Frontend Developer)",
      ],
      teamList: [
        {
          name: "Gaurav Kumar Yadav",
          role: "Full Stack Developer",
          portfolio: "https://ggauravky.vercel.app/",
        },
        {
          name: "Nikhil Agrahari",
          role: "Backend Developer",
          portfolio: "https://nikhilxagr.vercel.app/",
        },
        {
          name: "Devansh Yadav",
          role: "Frontend Developer",
          portfolio: "https://ydevansh.vercel.app/",
        },
      ],
      context:
        "Built collaboratively for campus dining management, dividing backend RBAC endpoints, aggregation queries, and responsive frontend screens.",
    },
    learnings: [
      "Validating user permissions server-side on every controller rather than relying on UI route guards.",
      "Using MongoDB $group and $avg stages instead of aggregating raw documents in Node.js memory.",
      "Designing single-tap mobile actions for time-sensitive workflows.",
      "Building table pagination from the first sprint to keep admin panels fast.",
    ],
    status: "Completed (Live in Production)",
    githubUrl: "https://github.com/nikhilxagr/SmartMess",
    liveDemoUrl: "https://smartmesslms.vercel.app/",
    imageUrl: "/images/projects/smartmess-cover.webp",
    featured: false,
    hasDetails: true,
  },
  {
    slug: "intube",
    title: "InTube",
    subtitle: "Stateless media analyzer and stream transcoding utility",
    category: "Full Stack",
    tagline:
      "Ad-free web downloader combining yt-dlp, Innertube fallbacks, and live FFmpeg piping for YouTube, Instagram, and Facebook.",
    description:
      "A privacy-focused media utility that inspects formats, muxes separated video and audio streams on the fly with FFmpeg, and leaves zero files on the server.",
    overview:
      "InTube separates link inspection, format resolution, and live stream transcoding across a React SPA and a Node.js streaming backend. Streams pipe through FFmpeg child processes directly to the client response and clean up immediately when the download finishes or aborts.",
    problemStatement:
      "Public downloader sites clutter pages with pop-ups, retain downloaded media files, or fail silently when cloud datacenter IPs hit anti-bot throttles and split DASH audio/video tracks.",
    solutionSummary:
      "Paired yt-dlp extraction flags with an Innertube fallback engine, piped split high-res tracks through FFmpeg with live transfer metrics, and hardened the API using Helmet, CORS, and rate limiting.",
    outcome:
      "Delivered a live, stateless downloader supporting HD/4K video muxing and 320kbps MP3 audio across Vercel and Render with zero persistent disk usage.",
    projectType: "Solo",
    tags: [
      "React",
      "Node.js",
      "Express.js",
      "yt-dlp",
      "FFmpeg",
      "Innertube",
      "Tailwind CSS",
      "REST API",
    ],
    highlights: [
      "Format Inspection: Resolves available video and audio streams for YouTube, Instagram, and Facebook.",
      "Fallback Engine: Switches cleanly between yt-dlp client presets and Innertube when cloud IPs face throttling.",
      "Stateless Piping: Merges DASH video and audio through FFmpeg streams without persisting user downloads.",
      "Live Telemetry: Reports extraction progress, speed, ETA, and stream muxing status to the UI.",
      "API Hardening: Enforces Express rate limiting, Helmet headers, and explicit cross-origin policies.",
    ],
    challenges: [
      "Bypassing datacenter IP bot blocks cleanly through rotating client flags and Innertube fallback lookups.",
      "Preventing memory leaks or lingering FFmpeg child processes when users cancel downloads mid-transfer.",
      "Aligning streaming response CORS headers between Vercel frontend hosting and Render API workers.",
      "Muxing separated 4K DASH video and audio containers cleanly on the fly without corrupting headers.",
    ],
    outcomes: [
      "Shipped a stateless web downloader supporting merged HD/4K video and standalone MP3 audio.",
      "Removed registration walls, ads, and server file retention completely.",
      "Hardened split production deployments on Vercel and Render behind request rate limits.",
      "Added XML sitemaps and Open Graph tags verified in Google Search Console.",
    ],
    techStackGrouped: {
      Frontend: ["React 18", "Vite", "Tailwind CSS", "React Router", "Axios"],
      Backend: ["Node.js (ESM)", "Express.js", "yt-dlp", "Innertube (YouTubei.js)", "FFmpeg"],
      "Security & Streams": ["Helmet.js", "CORS", "Express Rate Limit", "Node Stream Pipes"],
      Deployment: ["Vercel (Frontend)", "Render (Backend)"],
    },
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "yt-dlp",
      "FFmpeg",
      "Tailwind CSS",
      "Innertube",
      "Vite",
    ],
    collaboration: {
      team: "Solo Engineering",
      members: ["Nikhil Agrahari (Full Stack Developer)"],
      context:
        "Built independently to practice Node stream backpressure, FFmpeg container piping, and resilient external extraction.",
    },
    learnings: [
      "Building fallback extraction routes when upstream hosts apply datacenter rate limits.",
      "Handling Node.js stream backpressure and killing orphaned FFmpeg processes when requests close early.",
      "Cleaning temporary stream state automatically so server memory and storage stay flat.",
      "Reporting live progress metrics from child process stderr output into browser updates.",
    ],
    status: "Live in Production",
    githubUrl: "https://github.com/nikhilxagr/InTube",
    liveDemoUrl: "https://intubedl.vercel.app/",
    imageUrl: "/images/projects/intube-cover.webp",
    featured: false,
    hasDetails: true,
  },
  {
    slug: "fast-feast",
    title: "Fast Feast",
    subtitle: "Responsive restaurant menu browsing and cart flow",
    category: "Web Dev",
    tagline:
      "Vanilla HTML, CSS, and JavaScript food ordering storefront with categorized dishes and live cart calculations.",
    description:
      "A frontend ordering interface built to explore restaurant menu layouts, quantity updates, and checkout summary steps.",
    overview:
      "Fast Feast demonstrates complete shopping cart state transitions using vanilla JavaScript and semantic HTML without external frameworks. Customers filter menu dishes, adjust quantities inside a live cart panel, and step through an order confirmation view across mobile and desktop screens.",
    problemStatement:
      "Introductory storefront layouts frequently lose cart totals when item quantities shift or break alignment across narrow mobile viewports.",
    solutionSummary:
      "Built a responsive CSS Grid catalog linked to vanilla JavaScript state handlers that recalculate item counts, subtotals, and checkout totals cleanly on every click.",
    outcome:
      "Published a fast, zero-dependency frontend storefront demonstrating cart state accuracy and clear responsive navigation on Netlify.",
    projectType: "Solo",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    highlights: [
      "Category Menu: Filterable food sections arranged in a responsive multi-column card grid.",
      "Live Cart Math: Add, increment, decrement, and remove items with automatic subtotal updates.",
      "Order Summary Flow: Guides users smoothly from dish selection to final order review.",
      "Responsive Layout: Adapts cards, images, and cart controls cleanly without horizontal overflow.",
    ],
    challenges: [
      "Keeping cart quantities and badge totals synchronized cleanly across rapid add and remove clicks without a UI library.",
      "Standardizing food card heights and image proportions so action buttons align consistently across rows.",
      "Keeping the mobile navigation and cart summary readable on small screens without horizontal scroll.",
    ],
    outcomes: [
      "Built an interactive end-to-end ordering UI using only semantic HTML, CSS, and vanilla JavaScript.",
      "Maintained accurate client cart calculations and responsive grid alignment.",
      "Deployed publicly on Netlify with sub-second static load time.",
    ],
    techStackGrouped: {
      "Core Web": ["HTML5", "CSS3", "Vanilla JavaScript"],
      "UI Patterns": ["CSS Grid & Flexbox", "DOM Event Delegation", "Responsive Breakpoints"],
      Hosting: ["Netlify"],
    },
    techStack: ["HTML", "CSS", "JavaScript"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Frontend Developer)"],
      context: "Created independently as a core web layout and DOM state exercise.",
    },
    learnings: [
      "Separating data updates from DOM re-rendering makes vanilla JavaScript cart logic easier to debug.",
      "Using event delegation prevents duplicate click handlers when dish rows re-render.",
      "Consistent image aspect ratios improve catalog scan speed more than heavy styling.",
    ],
    status: "Live on Netlify",
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
    subtitle: "MERN URL shortener with collision-safe slug routing",
    category: "Full Stack",
    tagline:
      "React, Express, and MongoDB link utility generating short URLs backed by indexed redirect endpoints.",
    description:
      "A full-stack URL shortener that turns long links into compact, validated short URLs stored persistently in MongoDB.",
    overview:
      "snapURL handles the full lifecycle of short link creation and redirection across React Router and Express. Destination links pass client and server validation before generating unique Mongoose-indexed slugs that redirect cleanly via Express route params.",
    problemStatement:
      "Long query strings break neatly formatted shares in messages and resumes, while static client tools lack persistent link storage or invalid-URL safeguards.",
    solutionSummary:
      "Paired a React form view calling Axios with Express REST endpoints backed by unique MongoDB slug indexes, instant clipboard copy feedback, and redirect lookup routes.",
    outcome:
      "Deployed a live MERN shortener on Vercel that validates URLs, persists generated slugs in MongoDB, and redirects traffic cleanly.",
    projectType: "Solo",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Mongoose", "Axios"],
    highlights: [
      "Unique Slugs: Generates compact short codes enforced with unique indexes in MongoDB.",
      "Fast Redirects: Express route lookup resolves short identifiers directly to destination URLs.",
      "Link Validation: Checks URL protocols and rejects blank or malformed inputs cleanly.",
      "Instant Copy: Displays newly generated links with one-click clipboard copy confirmation.",
    ],
    challenges: [
      "Preventing duplicate slug collisions safely at the schema level with unique index constraints.",
      "Returning clean 404 fallback views when users open missing or expired short codes.",
      "Keeping generated domain prefixes accurate across localhost development and Vercel deployments.",
    ],
    outcomes: [
      "Wired React validation and Axios requests cleanly into persistent Express and MongoDB routes.",
      "Eliminated broken redirects through strict URL input checks and clear HTTP status codes.",
      "Published the live link shortener on Vercel.",
    ],
    techStackGrouped: {
      Frontend: ["React", "React Router DOM", "JavaScript", "Axios"],
      Backend: ["Node.js", "Express.js", "REST API"],
      Database: ["MongoDB", "Mongoose"],
      Deployment: ["Vercel"],
    },
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
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Full Stack Developer)"],
      context: "Built independently as a focused REST routing and MongoDB indexing project.",
    },
    learnings: [
      "Indexing slug fields in MongoDB keeps redirect lookups constant-time as links grow.",
      "Separating frontend route paths cleanly from server short-slug endpoints prevents React Router conflicts.",
      "Returning consistent Express JSON error messages simplifies inline client feedback.",
    ],
    status: "Live on Vercel",
    githubUrl: "https://github.com/nikhilxagr/snapurl-URL-SHORTNER",
    liveDemoUrl: "https://snapurl-url-shortner.vercel.app/",
    imageUrl: "/images/projects/snapurl-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "ai-powered-code-reviewer",
    title: "AI Powered Code Reviewer",
    subtitle: "MERN split-pane workspace for automated code inspection",
    category: "AI",
    tagline:
      "React and Node.js review tool calling server-proxied AI prompts to catch bugs, risks, and save review history.",
    description:
      "A developer workspace that accepts code snippets, surfaces potential bugs and security flaws through AI review prompts, and logs past audits.",
    overview:
      "AI Powered Code Reviewer pairs a split-pane code editor in React with Express proxy endpoints and MongoDB persistence. Developers paste code on the left to inspect concrete readability and security fixes on the right, while keeping past submissions saved per session.",
    problemStatement:
      "Manual code reviews take time to schedule, and solo learners need structured pre-commit feedback on edge-case bugs and unsafe code without losing history in stateless chats.",
    solutionSummary:
      "Connected a split-view React editor to Node/Express endpoints that proxy AI review prompts safely with server-side API keys and store submitted snippets alongside feedback in MongoDB.",
    outcome:
      "Delivered a structured self-review tool with readable fix snippets, API credential isolation, and persistent audit logs.",
    projectType: "Solo",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "AI / Gemini"],
    highlights: [
      "Split-Pane Editor: Submit code beside formatted, readable Markdown review recommendations.",
      "Bug & Risk Checks: Prompts inspect code explicitly for missing error handling and unsafe patterns.",
      "Concrete Fix Snippets: Returns refactored examples rather than generic one-sentence comments.",
      "Saved Review History: Persists past submissions and critique outputs cleanly in MongoDB.",
    ],
    challenges: [
      "Tuning review prompts to highlight genuine logic bugs and security checks ahead of minor formatting style notes.",
      "Rendering multi-language code blocks cleanly inside split panes across laptop screens.",
      "Validating submitted text length safely on Express endpoints before invoking AI models.",
    ],
    outcomes: [
      "Kept external AI API keys isolated strictly inside Express server routes.",
      "Saved code submissions and corresponding feedback reliably inside MongoDB.",
      "Built a focused developer layout suited to quick pre-commit self-checks.",
    ],
    techStackGrouped: {
      Frontend: ["React", "JavaScript"],
      Backend: ["Node.js", "Express.js", "REST API"],
      Database: ["MongoDB"],
      "AI Integration": ["Gemini API", "Structured Code Audit Prompts"],
    },
    techStack: ["MongoDB", "Express.js", "React", "Node.js"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Full Stack Developer)"],
      context: "Developed independently to practice server-proxied AI workflows and MERN persistence.",
    },
    learnings: [
      "Proxying AI calls through Express protects credentials and allows input length enforcement.",
      "Clear prompt formatting rules produce much more consistent diffs and headings in the UI.",
      "Persisting input/output pairs turns AI utilities into a reusable reference log.",
    ],
    status: "Completed",
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
    subtitle: "Offline-ready note manager saved in browser storage",
    category: "Web Dev",
    tagline:
      "Zero-dependency vanilla JavaScript notes workspace with live keyword filtering and LocalStorage persistence.",
    description:
      "A fast browser utility for writing, editing, filtering, and deleting notes locally without accounts or network requests.",
    overview:
      "Notes App removes login friction from everyday browser scratchpads using semantic HTML, CSS card grids, and LocalStorage persistence. Edits serialize automatically to local storage so notes survive tab closes and filter instantaneously as you type.",
    problemStatement:
      "Heavy cloud note tools require sign-ins and load delays when users just need an instant scratchpad saved right in their browser.",
    solutionSummary:
      "Implemented plain JavaScript CRUD functions synchronized against browser LocalStorage keys alongside live client-side text search.",
    outcome:
      "Shipped an instant-loading note utility on Netlify with zero dependencies and reliable offline storage.",
    projectType: "Solo",
    tags: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    highlights: [
      "Note CRUD: Create, edit inline, and delete note cards directly inside the grid.",
      "Auto-Sync Storage: Writes changes automatically to browser LocalStorage across sessions.",
      "Live Filtering: Narrows displayed note cards instantaneously by search keyword.",
      "Zero Dependencies: Runs with minimal footprint using native browser APIs.",
    ],
    challenges: [
      "Preserving cursor position cleanly while automatically saving inline textarea updates.",
      "Parsing LocalStorage keys defensively so empty or corrupted entries never break startup.",
      "Maintaining tidy grid alignment across cards with varying note text lengths.",
    ],
    outcomes: [
      "Built reliable offline persistence purely through the browser Web Storage API.",
      "Delivered instant search filtering over local JSON entries.",
      "Published publicly on Netlify.",
    ],
    techStackGrouped: {
      "Core Web": ["HTML5", "CSS3", "JavaScript"],
      "Browser APIs": ["Web Storage API (LocalStorage)", "DOM Manipulation"],
      Hosting: ["Netlify"],
    },
    techStack: ["HTML", "CSS", "JavaScript"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Frontend Developer)"],
      context: "Built as part of foundational vanilla JavaScript and browser storage practice.",
    },
    learnings: [
      "Wrapping JSON.parse in try/catch avoids broken hydration on stale storage values.",
      "Debouncing note writes keeps continuous typing smooth.",
      "Setting textContent rather than innerHTML prevents script injection from saved note text.",
    ],
    status: "Live on Netlify",
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Notes%20App",
    liveDemoUrl: "https://notes-app-agr.netlify.app/",
    imageUrl: "/images/projects/notes-app-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "qrcode-generator",
    title: "QRCode Generator",
    subtitle: "Client-side QR code maker with instant PNG export",
    category: "Web Dev",
    tagline:
      "Web utility for encoding URLs, Wi-Fi strings, and text snippets into high-contrast downloadable QR codes.",
    description:
      "A single-purpose browser tool that validates input strings, renders scannable QR codes on submit, and supports direct image saving.",
    overview:
      "QRCode Generator turns URLs or text snippets into scannable codes right in the browser with no registration wall. Empty inputs trigger inline shake/border feedback while valid entries render clean images ready for download.",
    problemStatement:
      "Many free online QR tools wrap simple link encoding in ads, expiring redirects, or account gates.",
    solutionSummary:
      "Built a clean HTML, CSS, and JavaScript encoder that URL-escapes user inputs, renders high-contrast QR images, and allows immediate saving.",
    outcome:
      "Delivered a fast, ad-free QR tool usable on mobile and desktop browsers via Netlify.",
    projectType: "Solo",
    tags: ["HTML", "CSS", "JavaScript", "QR Code API"],
    highlights: [
      "Fast Generation: Renders scannable QR outputs immediately for any non-empty URL or text.",
      "Image Saving: Exports sharp codes directly for slides, handouts, or quick sharing.",
      "Empty-Input Check: Highlights blank fields cleanly before making generation requests.",
      "Scanner Reliability: Preserves clean border padding for reliable phone camera reads.",
    ],
    challenges: [
      "Maintaining consistent quiet-zone margins so phone cameras scan reliably in varied lighting.",
      "Escaping URL query characters cleanly via encodeURIComponent before rendering.",
      "Keeping generated QR images sharp across high-DPI mobile and laptop displays.",
    ],
    outcomes: [
      "Built an ad-free browser utility with immediate input validation feedback.",
      "Verified reliable camera scanning across links, plain text, and contact snippets.",
      "Hosted publicly on Netlify.",
    ],
    techStackGrouped: {
      "Core Web": ["HTML5", "CSS3", "JavaScript"],
      Integration: ["QR Generation API", "URI Encoding"],
      Hosting: ["Netlify"],
    },
    techStack: ["HTML", "CSS", "JavaScript"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Frontend Developer)"],
      context: "Created to practice image export and form input validation in vanilla JavaScript.",
    },
    learnings: [
      "Encoding URL parameters cleanly prevents broken payloads when links contain query symbols.",
      "Consistent margins around QR patterns directly affect mobile scan speed.",
      "Concise state transitions make single-purpose utilities effortless to operate.",
    ],
    status: "Live on Netlify",
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/QR%20Code%20Generator",
    liveDemoUrl: "https://qrcode-generator-agr.netlify.app/",
    imageUrl: "/images/projects/qrcode-generator-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "weather-app",
    title: "Weather App",
    subtitle: "Global city weather lookup powered by OpenWeather API",
    category: "Web Dev",
    tagline:
      "Async Fetch dashboard displaying real-time temperature, humidity, wind speed, and condition icons for any city.",
    description:
      "A clean city forecast tool using the OpenWeather REST API to show current conditions, atmospheric metrics, and invalid-city error states.",
    overview:
      "Weather App demonstrates native browser Fetch requests with async/await error handling. Typing a city fetches current temperature, percentage humidity, and wind velocity, swaps weather icons by API condition code, and shows a clear inline state on 404 responses.",
    problemStatement:
      "Checking quick weather conditions on large portal sites forces users through banner ads and auto-playing video clutter.",
    solutionSummary:
      "Wired an async Fetch client to OpenWeather endpoints with metric formatting, icon mapping (clear, clouds, rain, mist), and explicit HTTP 404 error handling.",
    outcome:
      "Delivered a compact, fast-loading weather client on Netlify with predictable search and error handling.",
    projectType: "Solo",
    tags: ["HTML", "CSS", "JavaScript", "OpenWeather API"],
    highlights: [
      "Live REST Lookup: Queries current city conditions asynchronously via native Fetch.",
      "Key Metrics: Shows rounded temperature, humidity percentage, and wind speed cleanly.",
      "Condition Mapping: Pairs OpenWeather states directly with dedicated visual icons.",
      "Error Handling: Displays a dedicated message when a city lookup returns 404.",
    ],
    challenges: [
      "Checking response.ok explicitly because Fetch resolves HTTP 404 errors rather than rejecting.",
      "Formatting fractional API temperatures consistently for quick mobile scanning.",
      "Triggering city queries cleanly from both Enter key presses and search button clicks.",
    ],
    outcomes: [
      "Practiced async/await JSON parsing and explicit HTTP error boundary handling.",
      "Built a responsive weather card usable across desktop and mobile screens.",
      "Hosted publicly on Netlify.",
    ],
    techStackGrouped: {
      "Core Web": ["HTML5", "CSS3", "JavaScript (Async/Await)"],
      API: ["OpenWeather REST API", "Fetch API"],
      Hosting: ["Netlify"],
    },
    techStack: ["HTML", "CSS", "JavaScript", "REST API"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Frontend Developer)"],
      context: "Developed independently to master asynchronous Fetch calls and REST API error states.",
    },
    learnings: [
      "Always inspect response.ok after Fetch calls because 4xx and 5xx codes do not throw exceptions.",
      "Separating JSON mapping from DOM rendering keeps metric formatting clean.",
      "Supporting Enter-key submit makes quick search utilities feel much snappier.",
    ],
    status: "Live on Netlify",
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Weather%20App%20(%20Using%20API%20)",
    liveDemoUrl: "https://weatherappagr.netlify.app/",
    imageUrl: "/images/projects/weather-app-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "todo-list-app",
    title: "To Do List App",
    subtitle: "Task checklist with completion states and browser persistence",
    category: "Web Dev",
    tagline:
      "Vanilla JavaScript daily checklist with event-delegated completion toggles, deletions, and LocalStorage saving.",
    description:
      "A lightweight daily task manager where users add items, toggle completed strike-through states, delete rows, and keep lists saved locally.",
    overview:
      "To Do List App keeps task tracking immediate by binding one delegated listener on the task container. Clicking a list item toggles completion styling, clicking its remove icon deletes the entry cleanly, and every update saves immediately to LocalStorage.",
    problemStatement:
      "Full team project tools add unnecessary setup overhead when someone simply wants to track a handful of daily tasks.",
    solutionSummary:
      "Engineered a single-screen checklist driven by parent container event delegation, whitespace input validation, and LocalStorage persistence.",
    outcome:
      "Delivered a quick daily checklist that preserves completed and pending tasks reliably across browser restarts.",
    projectType: "Solo",
    tags: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    highlights: [
      "Fast Entry: Append daily tasks quickly via keyboard Enter or Add click.",
      "Clear States: Strike-through styling separates completed items cleanly from active tasks.",
      "Delegated Removal: Single parent click listener handles task toggling and deletion.",
      "Saved State: Restores checklist order and completion flags automatically on reload.",
    ],
    challenges: [
      "Distinguishing row completion clicks accurately from nested delete button clicks inside list rows.",
      "Blocking blank whitespace submissions before appending new DOM elements.",
      "Hydrating saved tasks reliably with checked states intact after browser reloads.",
    ],
    outcomes: [
      "Applied parent event delegation and explicit event target checks cleanly.",
      "Maintained zero runtime bloat without external framework dependencies.",
      "Hosted publicly on Netlify.",
    ],
    techStackGrouped: {
      "Core Web": ["HTML5", "CSS3", "JavaScript"],
      Storage: ["Browser LocalStorage", "Event Delegation"],
      Hosting: ["Netlify"],
    },
    techStack: ["HTML", "CSS", "JavaScript"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Frontend Developer)"],
      context: "Developed independently as a core DOM delegation and local persistence project.",
    },
    learnings: [
      "Parent-level click delegation removes manual listener wiring for dynamically added items.",
      "Trimming text inputs before insertion prevents phantom empty tasks.",
      "Persisting structured JSON task objects is safer than storing raw innerHTML snapshots.",
    ],
    status: "Live on Netlify",
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/To%20do%20List",
    liveDemoUrl: "https://todo-list-agr.netlify.app/",
    imageUrl: "/images/projects/todo-list-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    subtitle: "Calendar-aware utility computing years, months, and days",
    category: "Web Dev",
    tagline:
      "JavaScript Date calculator applying month-borrowing logic and leap-year lookups for accurate chronological age.",
    description:
      "An interactive date utility that calculates exact elapsed years, months, and days from any birth date while handling varying month lengths.",
    overview:
      "Age Calculator uses calendar boundary math instead of naive 365-day division. It accounts for 28 to 31 day months and February leap years using native JavaScript Date calculations while blocking future-date selection at the picker level.",
    problemStatement:
      "Dividing elapsed timestamps by 365 days drifts off by several days over years because calendar month lengths and leap years vary.",
    solutionSummary:
      "Implemented calendar subtraction with month-day borrowing helpers using native Date methods alongside future-date input constraints.",
    outcome:
      "Delivered an instant age computation utility suited to form validation and quick eligibility checks on Netlify.",
    projectType: "Solo",
    tags: ["HTML", "CSS", "JavaScript", "Date Algorithms"],
    highlights: [
      "Broken-Down Age: Reports exact years, months, and remaining calendar days side by side.",
      "Leap-Year Handling: Accounts accurately for 29-day February cycles via month-length helpers.",
      "Input Bounds: Restricts date selection to today or earlier so outputs stay valid.",
      "Instant Readout: Updates displayed numbers cleanly with zero reload.",
    ],
    challenges: [
      "Handling calendar borrow logic correctly when the current day is smaller than the birth day across month transitions.",
      "Remembering to offset zero-indexed JavaScript Date getMonth() return values consistently.",
      "Preventing empty picker clicks from calculating NaN date outputs.",
    ],
    outcomes: [
      "Solved calendar math accurately without importing Moment or Day.js.",
      "Guarded invalid empty or future dates cleanly in both HTML and JavaScript.",
      "Published live on Netlify.",
    ],
    techStackGrouped: {
      "Core Web": ["HTML5", "CSS3", "JavaScript"],
      "Logic & Math": ["JS Date API", "Calendar Borrowing Algorithms"],
      Hosting: ["Netlify"],
    },
    techStack: ["HTML", "CSS", "JavaScript"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Frontend Developer)"],
      context: "Created to practice edge-case calendar math and native JS Date handling.",
    },
    learnings: [
      "Using new Date(year, month, 0).getDate() returns the exact day count for any month and leap year.",
      "Zero-indexed months in JavaScript require deliberate +1 normalization for display.",
      "Setting max date constraints directly on native date inputs catches bad user entries early.",
    ],
    status: "Live on Netlify",
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Age%20Calculator",
    liveDemoUrl: "https://age-calc-agr.netlify.app/",
    imageUrl: "/images/projects/age-calculator-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "text-to-speech",
    title: "Text To Speech Converter",
    subtitle: "Browser speech synthesizer with selectable system voices",
    category: "Web Dev",
    tagline:
      "Zero-backend Web Speech API tool converting entered text into spoken audio with voice and accent controls.",
    description:
      "A browser-only narration utility powered by window.speechSynthesis for listening to written text using local OS voices.",
    overview:
      "Text To Speech Converter connects user text directly to the browser's built-in speech synthesis engine without uploading data to external servers. It detects available system voices via voiceschanged events and lets listeners switch voices cleanly.",
    problemStatement:
      "Proofreading copy aloud through third-party web tools often requires uploading private text to remote servers or paying per character.",
    solutionSummary:
      "Bound a clean text input card to the native Browser Web Speech API with asynchronous voice hydration and clean utterance resetting.",
    outcome:
      "Built a private, zero-server narration utility hosted publicly on Netlify.",
    projectType: "Solo",
    tags: ["HTML", "CSS", "JavaScript", "Web Speech API"],
    highlights: [
      "Local Voice Engine: Speaks written text directly inside the browser using Web Speech APIs.",
      "Voice Selector: Populates available operating system and browser accents dynamically.",
      "Private Client Run: Keeps all entered text inside the browser tab with zero server calls.",
      "Clean Playback: Cancels queued speech cleanly before speaking edited drafts.",
    ],
    challenges: [
      "Handling Chromium async voice loading where getVoices() returns empty until onvoiceschanged fires.",
      "Preventing overlapping speech queues when listeners press Play multiple times.",
      "Styling native select dropdown menus cleanly alongside large textareas.",
    ],
    outcomes: [
      "Handled cross-browser asynchronous voice discovery across Chromium and Firefox engines.",
      "Built a helpful local accessibility utility requiring zero API keys or servers.",
      "Published publicly on Netlify.",
    ],
    techStackGrouped: {
      "Core Web": ["HTML5", "CSS3", "JavaScript"],
      "Browser API": ["Web Speech API (speechSynthesis)", "SpeechSynthesisUtterance"],
      Hosting: ["Netlify"],
    },
    techStack: ["HTML", "CSS", "JavaScript", "Web Speech API"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Frontend Developer)"],
      context: "Built to explore browser accessibility and speech synthesis APIs using vanilla JS.",
    },
    learnings: [
      "Listening to speechSynthesis.onvoiceschanged is necessary because Chromium populates system voices asynchronously.",
      "Calling speechSynthesis.cancel() before speak() keeps edits responsive.",
      "Native browser capabilities eliminate paid third-party TTS calls for client tools.",
    ],
    status: "Live on Netlify",
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Text%20To%20Speech",
    liveDemoUrl: "https://text-to-speech-agr.netlify.app/",
    imageUrl: "/images/projects/text-to-speech-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "music-player",
    title: "Music Player",
    subtitle: "Custom HTML5 web audio player with interactive seek bar",
    category: "Web Dev",
    tagline:
      "Browser audio player connecting HTML5 media elements with custom play/pause icons and live progress scrubbing.",
    description:
      "A compact web audio player pairing custom transport buttons, dynamic range seek sliders, and metadata display over the HTML5 Audio API.",
    overview:
      "Music Player replaces mismatched default browser <audio> bars with a unified player layout. JavaScript binds loadedmetadata and progress intervals directly to a range input so listeners can scrub playback timestamps and toggle play states seamlessly.",
    problemStatement:
      "Standard native <audio> tags look inconsistent across browsers and resist custom layout theming.",
    solutionSummary:
      "Controlled an underlying HTMLAudioElement programmatically via custom play/pause icons and continuous range-slider synchronization.",
    outcome:
      "Shipped a responsive, compact web player on Netlify demonstrating HTML5 Media events and seek-bar synchronization.",
    projectType: "Solo",
    tags: ["HTML", "CSS", "JavaScript", "HTML5 Audio"],
    highlights: [
      "Custom Transport Bar: Replaces raw browser controls with play, pause, and step buttons.",
      "Interactive Seek Slider: Range input tracks playback progress live and seeks cleanly on drag.",
      "Dynamic Button Icons: Updates active play and pause states immediately on track end or click.",
      "Compact Framing: Presents artwork, song metadata, and playback actions inside a single card.",
    ],
    challenges: [
      "Keeping the seek range slider smooth during playback while avoiding visual jitter during manual dragging.",
      "Waiting cleanly for loadedmetadata before reading audio duration bounds.",
      "Resetting play button state automatically when a track plays through to the end.",
    ],
    outcomes: [
      "Mastered HTML5 Media Element metadata events and currentTime control in vanilla JS.",
      "Built an accessible, responsive player card.",
      "Deployed publicly on Netlify.",
    ],
    techStackGrouped: {
      "Core Web": ["HTML5", "CSS3", "JavaScript"],
      "Media API": ["HTML5 Audio API", "Media Timeupdate Events"],
      Hosting: ["Netlify"],
    },
    techStack: ["HTML", "CSS", "JavaScript"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Frontend Developer)"],
      context: "Built independently to practice browser audio APIs and synchronized seek controls.",
    },
    learnings: [
      "Initializing range max values inside onloadedmetadata prevents NaN durations on initial load.",
      "Coordinating interval updates carefully keeps slider thumb position responsive during scrubs.",
      "Listening for the audio ended event keeps button icons accurate after playback completes.",
    ],
    status: "Live on Netlify",
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Music%20Player",
    liveDemoUrl: "https://music-player-agr.netlify.app/",
    imageUrl: "/images/projects/music-player-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "mini-calendar",
    title: "Mini Calendar App",
    subtitle: "Split-panel date widget synced with the local system clock",
    category: "Web Dev",
    tagline:
      "Lightweight web date widget converting native JS Date objects into formatted weekday, month, day, and year panels.",
    description:
      "A compact two-column calendar card displaying live numeric date, weekday, month name, and year synced directly with system time.",
    overview:
      "Mini Calendar App focuses on crisp typographic hierarchy backed by simple JavaScript Date lookup arrays. Mapping zero-based weekday and month numbers into readable labels gives the widget an immediate editorial split-panel look.",
    problemStatement:
      "Default JS Date getters return raw integers and verbose timestamp strings that need manual formatting for UI widgets.",
    solutionSummary:
      "Mapped native Date getters into full weekday/month label arrays with zero-padded day numbers inside a responsive two-column container.",
    outcome:
      "Published an instant-loading static date card on Netlify demonstrating clean scale and typography balance.",
    projectType: "Solo",
    tags: ["HTML", "CSS", "JavaScript"],
    highlights: [
      "Split Layout: Contrasts large numeric day figures cleanly against weekday and month context.",
      "Readable Formatting: Converts zero-indexed JS day and month integers into full names.",
      "Zero-Padded Days: Aligns single-digit dates cleanly for uniform alignment.",
      "Lightweight Load: Runs directly on vanilla HTML, CSS, and JavaScript.",
    ],
    challenges: [
      "Padding single-digit dates (e.g., 04 instead of 4) so large centered day figures hold balanced proportions.",
      "Mapping 0-indexed Sunday and January values reliably across display arrays.",
      "Preserving balanced column spacing on narrow phone screens.",
    ],
    outcomes: [
      "Practiced strong display vs secondary type hierarchy in a minimal interface.",
      "Verified accurate local timezone date readout across desktop and mobile browsers.",
      "Hosted publicly on Netlify.",
    ],
    techStackGrouped: {
      "Core Web": ["HTML5", "CSS3", "JavaScript"],
      Formatting: ["JS Date Object", "Locale Lookup Arrays"],
      Hosting: ["Netlify"],
    },
    techStack: ["HTML", "CSS", "JavaScript"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Frontend Developer)"],
      context: "Created independently to practice layout contrast and native JS Date helpers.",
    },
    learnings: [
      "Lookup arrays make weekday and month formatting far cleaner than switch chains.",
      "Strong typographic size contrast creates clear hierarchy without extra decoration.",
      "Zero-padding single digits avoids layout shifting between dates 1 to 9 and 10 to 31.",
    ],
    status: "Live on Netlify",
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Mini%20Calendar",
    liveDemoUrl: "https://mini-calender-agr.netlify.app/",
    imageUrl: "/images/projects/mini-calendar-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "upi-qrcode-generator",
    title: "UPI QR Code Generator",
    subtitle: "Python desktop app generating offline NPCI UPI QR codes",
    category: "Python",
    tagline:
      "Tkinter and Pillow GUI tool creating standard upi://pay payment codes with merchant VPA, name, fixed amount, and PNG export.",
    description:
      "A desktop Python GUI built with Tkinter and Pillow to create scannable UPI payment QR codes offline with fixed amount and PNG export support.",
    overview:
      "UPI QR Code Generator lets merchants and freelancers generate instant UPI codes offline from the desktop. Entering a UPI handle, payee name, and optional billing amount builds an NPCI-compliant upi://pay URI rendered live via Pillow and exported cleanly to PNG.",
    problemStatement:
      "Independent merchants needing fixed-amount payment codes often depend on slow internet tools that cannot export crisp local PNG files directly.",
    solutionSummary:
      "Built Tkinter form inputs feeding NPCI URI formatting helpers, live Pillow ImageTk canvas previews, and local file saving dialogs.",
    outcome:
      "Delivered a reliable offline desktop utility generating codes scannable in PhonePe, Google Pay, Paytm, and BHIM.",
    projectType: "Solo",
    tags: ["Python", "Tkinter", "Pillow", "QRCode"],
    highlights: [
      "NPCI URI Builder: Formats compliant upi://pay strings with VPA (pa), payee name (pn), amount (am), and INR.",
      "Live GUI Preview: Displays PIL-generated QR codes directly inside the Tkinter window.",
      "Offline PNG Export: Saves sharp high-contrast payment images straight to local disk.",
      "Input Checks: Validates UPI handle formatting and numeric amounts before rendering.",
    ],
    challenges: [
      "URL-encoding payee names containing spaces so mobile scanner apps parse every field cleanly.",
      "Keeping explicit Python references to PhotoImage objects so Tkinter does not garbage-collect the canvas preview.",
      "Validating numeric billing amounts strictly before building decimal URI strings.",
    ],
    outcomes: [
      "Verified scannable UPI strings across multiple Indian mobile payment apps.",
      "Integrated Pillow matrix rendering smoothly inside native Tkinter callbacks.",
      "Delivered a standalone offline desktop helper.",
    ],
    techStackGrouped: {
      Language: ["Python 3"],
      "GUI & Imaging": ["Tkinter", "Pillow (PIL)", "qrcode"],
      Protocol: ["NPCI UPI URI Spec"],
    },
    techStack: ["Python", "Tkinter", "Pillow", "QRCode Lib"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Python Developer)"],
      context: "Built independently while practicing Python desktop GUIs and Pillow image encoding.",
    },
    learnings: [
      "Storing persistent references to Tkinter PhotoImage instances stops canvas previews from disappearing.",
      "Consistent URI encoding on merchant names is critical for UPI parser compatibility.",
      "Separating URI construction functions from GUI callbacks simplifies edge-case testing.",
    ],
    status: "Completed (Desktop App)",
    githubUrl:
      "https://github.com/nikhilxagr/Python-projects/tree/main/QR%20Code%20Generator",
    liveDemoUrl: "",
    imageUrl: "/images/projects/upi-qrcode-generator-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "tic-tac-toe-python",
    title: "Tic Tac Toe (Python GUI)",
    subtitle: "Object-oriented 2-player desktop game built in Tkinter",
    category: "Python",
    tagline:
      "Python Tkinter grid game implementing 2D array board checks, alternating turns, victory dialogs, and reset logic.",
    description:
      "A desktop 2-player Tic Tac Toe application written in Python and Tkinter featuring 3x3 board checks, turn tracking, and round resets.",
    overview:
      "Tic Tac Toe applies event-driven Python programming and 2D matrix checks inside a clean 3x3 Tkinter button grid. Every cell press updates an authoritative board matrix, evaluates rows, columns, and diagonals for win or draw conditions, and updates round scores.",
    problemStatement:
      "Introductory GUI code often mixes visual button states directly with game logic, making diagonal checks and multi-round resets error-prone.",
    solutionSummary:
      "Maintained a dedicated 3x3 matrix array alongside Tkinter button callbacks, isolating win/draw algorithms, dialog notifications, and score resets cleanly.",
    outcome:
      "Created a clean 2-player desktop application demonstrating Python OOP structure, lambda binding discipline, and GUI state management.",
    projectType: "Solo",
    tags: ["Python", "Tkinter", "OOP"],
    highlights: [
      "3x3 Tkinter Grid: Responsive button grid mapped directly to matrix coordinates.",
      "Win & Draw Logic: Checks all 8 winning lines and full-board draws after every valid turn.",
      "Turn Protection: Prevents overwriting occupied squares and toggles active player labels.",
      "Scoreboard & Reset: Tracks X vs O wins across rounds and resets the board cleanly.",
    ],
    challenges: [
      "Evaluating draws accurately only after checking all 8 win conditions fail on the 9th turn.",
      "Binding button loop indices with default lambda keyword arguments so every cell maps to its own row and column.",
      "Resetting widget text, disabled flags, and winner highlights consistently across new games.",
    ],
    outcomes: [
      "Applied proper Python lambda closure scoping inside dynamic button grids.",
      "Kept matrix evaluation decoupled from Tkinter widget presentation.",
      "Built a dependable 2-player desktop game.",
    ],
    techStackGrouped: {
      Language: ["Python 3"],
      "GUI Framework": ["Tkinter", "tkinter.messagebox"],
      Concepts: ["OOP Design", "2D Matrix State", "Event Callbacks"],
    },
    techStack: ["Python", "Tkinter", "OOP"],
    collaboration: {
      team: "Solo Build",
      members: ["Nikhil Agrahari (Python Developer)"],
      context: "Created independently to apply Python OOP concepts and desktop event handling.",
    },
    learnings: [
      "Binding loop variables via default lambda args (r=row, c=col) avoids late-binding callback bugs.",
      "Treating the 2D array as source of truth stops UI state from drifting.",
      "Dedicated reset helpers keep multi-round replay simple without restarting the app.",
    ],
    status: "Completed (Desktop App)",
    githubUrl:
      "https://github.com/nikhilxagr/Python-projects/tree/main/Tic%20Tac%20Toe%20Game",
    liveDemoUrl: "",
    imageUrl: "/images/projects/tic-tac-toe-cover.webp",
    featured: true,
    hasDetails: true,
  },
];
